const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const toURLString = require('../../utils/toURLString');
 
const WritingFilter = require('../writing_filter/WritingFilter');

const getWritingByLanguageAndOptions = require('./functions/getWritingByLanguageAndOptions');

const ALLOWED_LANGUAGE_VALUES = ['en', 'tr', 'ru'];
const DEFAULT_LANGUAGE = 'en';
const LABEL_VALUES = ['slider', 'editors_pick', 'exclusive'];
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e5;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const WritingSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  identifiers: {
    type: Array,
    default: []
  },
  identifier_languages: {
    type: Object,
    default: {}
  },
  type: {
    type: String,
    required: true
  },
  parent_id: { // ID of a type from TYPE_VALUES
    type: mongoose.Types.ObjectId,
    required: true
  },
  parent_identifiers: {
    type: Array,
    default: []
  },
  parent_identifier_languages: {
    type: Object,
    default: {}
  },
  parent_title: {
    type: String,
    default: null,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  parent_image: {
    type: String,
    default: null,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  writer_id: {
    type: mongoose.Types.ObjectId,
    default: null
  },
  created_at: {
    type: Date,
    required: true
  },
  subtitle: {
    type: String,
    default: '',
    trim: true,
    minlength: 0,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  logo: {
    type: String,
    default: null,
    minlength: 0,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  cover: {
    type: String,
    default: null,
    minlength: 0,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: null,
    trim: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  flag: {
    type: String,
    default: null,
    trim: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  social_media_accounts: {
    type: Object,
    default: {}
  },
  content: {
    type: Array,
    default: [],
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  },
  translations: {
    type: Object,
    default: {}
  },
  order: {
    type: Number,
    required: true
  },
  is_hidden: {
    type: Boolean,
    default: false
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  view_count: {
    type: Number,
    default: 0
  }
});

WritingSchema.statics.findWritingById = function (id, callback) {
  const Writing = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Writing.findById(mongoose.Types.ObjectId(id.toString()), (err, writing) => {
    if (err) return callback('database_error');
    if (!writing) return callback('document_not_found');

    return callback(null, writing);
  });
};

WritingSchema.statics.findWritingByIdAndFormatByLanguage = function (id, language, callback) {
  const Writing = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  if (!language || !ALLOWED_LANGUAGE_VALUES.includes(language))
    return callback('bad_request');

  Writing.findById(mongoose.Types.ObjectId(id.toString()), (err, writing) => {
    if (err) return callback(err);

    if (!writing.is_completed)
      return callback('not_authenticated_request');

    getWritingByLanguageAndOptions(writing, language, {}, (err, writing) => {
      if (err) return callback(err);

      return callback(null, writing);
    });
  });
};

WritingSchema.statics.findWritingByIdentifierAndFormatByLanguage = function (identifier, language, callback) {
  const Writing = this;

  if (!identifier || typeof identifier != 'string' || !identifier.trim().length || identifier.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  Writing.findOne({
    identifiers: toURLString(identifier)
  }, (err, writing) => {
    if (err) return callback('database_error');
    if (!writing) return callback('document_not_found');

    Writing.findWritingByIdAndFormatByLanguage(writing._id, language, (err, writing) => {
      if (err) return callback(err);

      return callback(null, writing);
    });
  });
};

WritingSchema.statics.findWritingsByFiltersAndFormatByLanguage = function (data, language, callback) {
  const Writing = this;

  WritingFilter.findWritingFiltersByFiltersAndLanguage(data, language, (err, writing_filters_data) => {
    if (err) return callback(err);

    Writing.find({ _id: { $in: writing_filters_data.id_list } }, (err, writings) => {
      if (err) return callback('database_error');

      async.timesSeries(
        writings.length,
        (time, next) => getWritingByLanguageAndOptions(writings[time], language, data, (err, writing) => next(err, writing)),
        (err, writings) => {
          if (err) return callback(err);
  
          return callback(null, {
            search: writing_filters_data.search,
            limit: writing_filters_data.limit,
            page: writing_filters_data.page,
            writings
          });
        }
      );
    });
  });
};

WritingSchema.statics.findWritingCountByFiltersAndLanguage = function (data, language, callback) {
  WritingFilter.findWritingFiltersCountByFiltersAndLanguage(data, language, (err, count) => {
    if (err) return callback(err);

    return callback(null, count);
  });
};

module.exports = mongoose.model('Writing', WritingSchema);
