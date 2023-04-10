const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getWriter = require('./functions/getWriter');
const getWriterByLanguage = require('./functions/getWriterByLanguage');

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

WriterSchema.statics.findWriterByIdAndFormat = function (id, callback) {
  const Writer = this;

  Writer.findWriterById(id, (err, writer) => {
    if (err) return callback(err);

    getWriter(writer, (err, writer) => {
      if (err) return callback(err);

      return callback(null, writer);
    });
  });
};

WriterSchema.statics.findWriterByIdAndFormatByLanguage = function (id, language, callback) {
  const Writer = this;

  if (!language || !validator.isISO31661Alpha2(language.toString()))
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

  if (!identifier || typeof identifier != 'string' || !identifier.trim().length)
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

WriterSchema.statics.findWritersByFilters = function (data, callback) {
  const Writer = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {};
  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) > 0 && parseInt(data.limit) < MAX_DOCUMENT_COUNT_PER_QUERY ? parseInt(data.limit) : DEFAULT_DOCUMENT_COUNT_PER_QUERY;
  const page = data.page && !isNaN(parseInt(data.page)) && parseInt(data.page) > 0 ? parseInt(data.page) : 0;
  const skip = page * limit;
  let search = null;

  if ('is_deleted' in data)
    filters.is_deleted = data.is_deleted ? true : false;

  if (data.search && typeof data.search == 'string' && data.search.trim().length && data.search.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH) {
    search = data.search.trim();
    filters.name = { $regex: search, $options: 'i' };
  };

  Writer
    .find(filters)
    .limit(limit)
    .skip(skip)
    .sort({ order: -1 })
    .then(writers => async.timesSeries(
      writers.length,
      (time, next) => Writer.findWriterByIdAndFormat(writers[time]._id, (err, writer) => next(err, writer)),
      (err, writers) => {
        if (err) return callback(err);

        return callback(null, {
          search,
          limit,
          page,
          writers
        });
      })
    )
    .catch(_ => callback('database_error'));
};

WriterSchema.statics.findWriterCountByFilters = function (data, callback) {
  const Writer = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {};

  if ('is_deleted' in data)
    filters.is_deleted = data.is_deleted ? true : false;

  if (data.search && typeof data.search == 'string' && data.search.trim().length && data.search.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.name = { $regex: data.search.trim(), $options: 'i' };

  Writer
    .find(filters)
    .countDocuments()
    .then(number => callback(null, number))
    .catch(_ => callback('database_error'));
};

module.exports = mongoose.model('Writer', WriterSchema);
