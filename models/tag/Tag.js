const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getTagByLanguage = require('./functions/getTagByLanguage');

const DEFAULT_DOCUMENT_COUNT_PER_QUERY = 20;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_DOCUMENT_COUNT_PER_QUERY = 1e2;

const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  identifiers: {
    type: Array,
    required: true,
    minlength: 0,
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  },
  identifier_languages: {
    type: Object,
    default: {}
  },
  url: {
    type: String,
    trim: true,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  created_at: {
    type: Date,
    required: true
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  translations: {
    type: Object,
    default: {}
  },
  order: {
    type: Number,
    required: true
  }
});

TagSchema.statics.findTagById = function (id, callback) {
  const Tag = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Tag.findById(mongoose.Types.ObjectId(id.toString()), (err, tag) => {
    if (err) return callback('database_error');
    if (!tag) return callback('document_not_found');

    return callback(null, tag);
  });
};

TagSchema.statics.findTagByIdAndFormatByLanguage = function (id, language, callback) {
  const Tag = this;

  if (!language || !validator.isISO31661Alpha2(language.toString()))
    return callback('bad_request');

  Tag.findTagById(id, (err, tag) => {
    if (err) return callback(err);

    if (!tag.is_completed)
      return callback('not_authenticated_request');

    getTagByLanguage(tag, language, (err, tag) => {
      if (err) return callback(err);

      return callback(null, tag);
    });
  });
};

TagSchema.statics.findTagsByFiltersAndFormatByLanguage = function (data, language, callback) {
  const Tag = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {};

  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) > 0 && parseInt(data.limit) < MAX_DOCUMENT_COUNT_PER_QUERY ? parseInt(data.limit) : DEFAULT_DOCUMENT_COUNT_PER_QUERY;
  const page = data.page && !isNaN(parseInt(data.page)) && parseInt(data.page) > 0 ? parseInt(data.page) : 0;
  const skip = page * limit;

  Tag
    .find(filters)
    .sort({ order: -1 })
    .limit(limit)
    .skip(skip)
    .then(tags => async.timesSeries(
      tags.length,
      (time, next) => getTagByLanguage(tags[time], language, (err, tag) => next(err, tag)),
      (err, tags) => {
        if (err) return callback(err);

        return callback(null, {
          limit,
          page,
          tags
        });
      })
    )
    .catch(err => callback('database_error'));
};

module.exports = mongoose.model('Tag', TagSchema);
