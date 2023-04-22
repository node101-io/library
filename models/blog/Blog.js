const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const toURLString = require('../../utils/toURLString');

const getBlogByLanguage = require('./functions/getBlogByLanguage');

const ALLOWED_LANGUAGE_VALUES = ['en', 'tr', 'ru'];
const DEFAULT_DOCUMENT_COUNT_PER_QUERY = 20;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_DATABASE_LONG_TEXT_FIELD_LENGTH = 1e5;
const MAX_DOCUMENT_COUNT_PER_QUERY = 1e2;
const TYPE_VALUES = ['node101', 'project', 'terms'];

const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  identifiers: {
    type: Array,
    required: true,
    minlength: 1
  },
  identifier_languages: {
    type: Object,
    default: {}
  },
  type: {
    type: String,
    default: null,
  },
  project_id: {
    type: mongoose.Types.ObjectId,
    default: null
  },
  writer_id: {
    type: mongoose.Types.ObjectId,
    default: null
  },
  subtitle: {
    type: String,
    default: null,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  search_title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_LONG_TEXT_FIELD_LENGTH
  },
  search_subtitle: {
    type: String,
    default: '',
    trim: true,
    maxlength: MAX_DATABASE_LONG_TEXT_FIELD_LENGTH
  },
  image: {
    type: String,
    default: null,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  is_completed: {
    type: Boolean,
    default: false
  },
  is_deleted: {
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
  writing_count: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    required: true
  }
});

BlogSchema.statics.findBlogById = function (id, callback) {
  const Blog = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Blog.findById(mongoose.Types.ObjectId(id.toString()), (err, blog) => {
    if (err) return callback('database_error');
    if (!blog) return callback('document_not_found');

    return callback(null, blog);
  });
};

BlogSchema.statics.findBlogByIdAndFormatByLanguage = function (id, language, callback) {
  const Blog = this;

  if (!language || !ALLOWED_LANGUAGE_VALUES.includes(language))
    return callback('bad_request');

  Blog.findBlogById(id, (err, blog) => {
    if (err) return callback(err);
    if (!blog.is_completed)
      return callback('not_authenticated_request');

    getBlogByLanguage(blog, language, (err, blog) => {
      if (err) return callback(err);

      return callback(null, blog);
    });
  });
};

BlogSchema.statics.findBlogByIdentifierAndFormatByLanguage = function (identifier, language, callback) {
  const Blog = this;

  if (!identifier || typeof identifier != 'string' || !identifier.trim().length || !identifier.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  Blog.findOne({
    identifiers: toURLString(identifier)
  }, (err, blog) => {
    if (err) return callback('database_error');
    if (!blog) return callback('document_not_found');

    Blog.findBlogByIdAndFormatByLanguage(blog._id, language, (err, blog) => {
      if (err) return callback(err);

      return callback(null, blog);
    });
  });
};

BlogSchema.statics.findBlogsByFiltersAndFormatByLanguage = function (data, language, callback) {
  const Blog = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {
    is_completed: true,
    is_deleted: false
  };

  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) > 0 && parseInt(data.limit) < MAX_DOCUMENT_COUNT_PER_QUERY ? parseInt(data.limit) : DEFAULT_DOCUMENT_COUNT_PER_QUERY;
  const page = data.page && !isNaN(parseInt(data.page)) && parseInt(data.page) > 0 ? parseInt(data.page) : 0;
  const skip = page * limit;

  if (data.type && typeof data.type == 'string' && TYPE_VALUES.includes(data.type))
    filters.type = data.type;

  if (!data.search || typeof data.search != 'string' || !data.search.trim().length) {
    Blog
      .find(filters)
      .sort({ order: -1 })
      .limit(limit)
      .skip(skip)
      .then(blogs => async.timesSeries(
        blogs.length,
        (time, next) => Blog.findBlogByIdAndFormatByLanguage(blogs[time]._id, language, (err, blog) => next(err, blog)),
        (err, blogs) => {
          if (err) return callback(err);

          return callback(null, {
            search: null,
            limit,
            page,
            blogs
          });
        })
      )
      .catch(_ => callback('database_error'));
  } else {
    filters.$text = { $search: data.search.trim() };

    Blog
      .find(filters)
      .sort({
        score: { $meta: 'textScore' }, 
        order: -1
      })
      .limit(limit)
      .skip(skip)
      .then(blogs => async.timesSeries(
        blogs.length,
        (time, next) => Blog.findBlogByIdAndFormatByLanguage(blogs[time]._id, language, (err, blog) => next(err, blog)),
        (err, blogs) => {
          if (err) return callback(err);

          return callback(null, {
            search: data.search.trim(),
            limit,
            page,
            blogs
          });
        })
      )
      .catch(_ => callback('database_error'));
  };
};

BlogSchema.statics.findBlogCountByFiltersAndLanguage = function (data, language, callback) {
  const Blog = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {
    is_completed: true,
    is_deleted: false
  };

  if (data.type && typeof data.type == 'string' && TYPE_VALUES.includes(data.type))
    filters.type = data.type;

  if (!data.search || typeof data.search != 'string' || !data.search.trim().length) {
    Blog
      .find(filters)
      .countDocuments()
      .then(count => callback(null, count))
      .catch(_ => callback('database_error'));
  } else {
    filters.$text = { $search: data.search.trim() };

    Blog
      .find(filters)
      .countDocuments()
      .then(count => callback(null, count))
      .catch(_ => callback('database_error'));
  };
};

module.exports = mongoose.model('Blog', BlogSchema);
