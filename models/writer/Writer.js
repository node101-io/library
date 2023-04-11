const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getWriterByLanguage = require('./functions/getWriterByLanguage');

const ALLOWED_LANGUAGE_VALUES = ['en', 'tr', 'ru'];
const DEFAULT_DOCUMENT_COUNT_PER_QUERY = 20;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_DOCUMENT_COUNT_PER_QUERY = 1e2;

const Schema = mongoose.Schema;

const WriterSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  identifier: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  created_at: {
    type: Date,
    required: true
  },
  title: {
    type: String,
    default: null,
    trim: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  image: {
    type: String,
    default: null,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  social_media_accounts: {
    type: Object,
    default: {}
  },
  translations: {
    type: Object,
    default: {}
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: true
  }
});

WriterSchema.statics.findWriterById = function (id, callback) {
  const Writer = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Writer.findById(mongoose.Types.ObjectId(id.toString()), (err, writer) => {
    if (err) return callback('database_error');
    if (!writer) return callback('document_not_found');

    return callback(null, writer);
  });
};

WriterSchema.statics.findWriterByIdAndFormatByLanguage = function (id, language, callback) {
  const Writer = this;

  if (!language || !ALLOWED_LANGUAGE_VALUES.includes(language))
    return callback('bad_request');

  Writer.findWriterById(id, (err, writer) => {
    if (err) return callback(err);

    if (!writer.is_completed)
      return callback('not_authenticated_request');

    getWriterByLanguage(writer, language, (err, writer) => {
      if (err) return callback(err);

      return callback(null, writer);
    });
  });
};

WriterSchema.statics.findWriterByIdenfierAndFormatByLanguage = function (identifier, language, callback) {
  const Writer = this;

  if (!identifier || typeof identifier != 'string' || !identifier.trim().length)
    return callback('bad_request');

  Writer.findOne({
    identifier: identifier.trim()
  }, (err, writer) => {
    if (err) return callback('database_error');
    if (!writer) return callback('document_not_found');
    if (!writer.is_completed)
      return callback('not_authenticated_request');

    Writer.findWriterByIdAndFormatByLanguage(
      writer._id,
      language,
      (err, writer) => callback(err, writer)
    );
  });
};

WriterSchema.statics.findWritersByFiltersAndFormatByLanguage = function (data, language, callback) {
  const Writer = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {
    is_completed: 'true',
    is_deleted: 'false'
  };
  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) > 0 && parseInt(data.limit) < MAX_DOCUMENT_COUNT_PER_QUERY ? parseInt(data.limit) : DEFAULT_DOCUMENT_COUNT_PER_QUERY;
  const page = data.page && !isNaN(parseInt(data.page)) && parseInt(data.page) > 0 ? parseInt(data.page) : 0;
  const skip = page * limit;

  Writer
    .find(filters)
    .limit(limit)
    .skip(skip)
    .sort({ order: -1 })
    .then(writers => async.timesSeries(
      writers.length,
      (time, next) => Writer.findWriterByIdAndFormatByLanguage(writers[time]._id, language, (err, writer) => next(err, writer)),
      (err, writers) => {
        if (err) return callback(err);

        return callback(null, {
          limit,
          page,
          writers
        });
      })
    )
    .catch(_ => callback('database_error'));
};

WriterSchema.statics.findWriterCountByFiltersAndLanguage = function (data, langugae, callback) {
  const Writer = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {
    is_completed: 'true',
    is_deleted: 'false'
  };

  Writer
    .find(filters)
    .countDocuments()
    .then(number => callback(null, number))
    .catch(_ => callback('database_error'));
};

module.exports = mongoose.model('Writer', WriterSchema);
