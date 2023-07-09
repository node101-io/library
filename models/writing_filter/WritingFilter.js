// IMPORTANT NOTES!
// This is a smaller WritingFilter model copy with only the required fields to filter WritingFilters faster on library.node101
// If a WritingFilter is { is_completed: false }, { is_deleted: true }, or { is_hidden: true } the WritingFilterFilter associated with it will be deleted automatically
// As this model is called only by WritingFilter model, no type check is made during the create / update functions

const mongoose = require('mongoose');
const validator = require('validator');

const DEFAULT_DOCUMENT_COUNT_PER_QUERY = 10;
const LABEL_VALUES = ['slider', 'editors_pick', 'exclusive'];
const LANGUAGE_VALUES = ['en', 'tr', 'ru'];
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_DATABASE_LONG_TEXT_FIELD_LENGTH = 1e5;
const MAX_DOCUMENT_COUNT_PER_QUERY = 1e2;

const Schema = mongoose.Schema;

const WritingFilterSchema = new Schema({
  writing_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  language: {
    type: String,
    length: 2,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_LONG_TEXT_FIELD_LENGTH
  },
  parent_id: {
    type: mongoose.Types.ObjectId,
    required: true
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
    maxlength: MAX_DATABASE_LONG_TEXT_FIELD_LENGTH
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
  }
});

WritingFilterSchema.statics.findWritingFiltersByFiltersAndLanguage = function (data, language, callback) {
  const WritingFilter = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');
  
  if (!language || !LANGUAGE_VALUES.includes(language))
    return callback('bad_request');

  const filters = {
    language
  };
  
  if (data.n_id && validator.isMongoId(data.n_id.toString()))
    filters.writing_id = { $ne: mongoose.Types.ObjectId(data.n_id.toString()) };

  if (data.label && LABEL_VALUES.includes(data.label))
    filters.label = data.label;

  if (data.flag && typeof data.flag == 'string' && data.flag.trim().length && data.flag.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.flag = data.flag.trim();

  if (data.parent_id && validator.isMongoId(data.parent_id.toString()))
    filters.parent_id = mongoose.Types.ObjectId(data.parent_id.toString());

  if (data.writer_id && validator.isMongoId(data.writer_id.toString()))
    filters.writer_id = mongoose.Types.ObjectId(data.writer_id.toString());

  if (data.search && typeof data.search == 'string' && data.search.trim().length && data.search.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.title = { $regex: data.search.trim(), $options: 'i' };

  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) > 0 && parseInt(data.limit) < MAX_DOCUMENT_COUNT_PER_QUERY ? parseInt(data.limit) : DEFAULT_DOCUMENT_COUNT_PER_QUERY;
  const page = data.page && !isNaN(parseInt(data.page)) && parseInt(data.page) > 0 ? parseInt(data.page) : 0;
  const skip = page * limit;

  WritingFilter
    .find(filters)
    .skip(skip)
    .sort({ created_at: -1 })
    .limit(limit)
    .then(writing_filters => callback(null, {
      search: 'title' in filters ? data.search.trim() : null,
      limit,
      page,
      id_list: writing_filters.map(each => each.writing_id)
    }))
    .catch(_ => callback('database_error'));
};

WritingFilterSchema.statics.findWritingFiltersCountByFiltersAndLanguage = function (data, language, callback) {
  const WritingFilter = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');
  
  if (!language || !LANGUAGE_VALUES.includes(language))
    return callback('bad_request');

  const filters = {
    language
  };

  if (data.label && LABEL_VALUES.includes(data.label))
    filters.label = data.label;

  if (data.flag && typeof data.flag == 'string' && data.flag.trim().length && data.flag.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.flag = data.flag.trim();

  if (data.parent_id && validator.isMongoId(data.parent_id.toString()))
    filters.parent_id = mongoose.Types.ObjectId(data.parent_id.toString());

  if (data.writer_id && validator.isMongoId(data.writer_id.toString()))
    filters.writer_id = mongoose.Types.ObjectId(data.writer_id.toString());

  if (data.search && typeof data.search == 'string' && data.search.trim().length && data.search.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.title = { $regex: data.search.trim(), $options: 'i' };

  WritingFilter
    .find(filters)
    .countDocuments()
    .then(count => callback(null, count))
    .catch(_ => callback('database_error'));
};

module.exports = mongoose.model('WritingFilter', WritingFilterSchema);
