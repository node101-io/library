const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const getProject = require('./functions/getProject');
const getProjectByLanguage = require('./functions/getProjectByLanguage');

const ALLOWED_LANGUAGE_VALUES = ['en', 'tr', 'ru'];
const DEFAULT_DOCUMENT_COUNT_PER_QUERY = 20;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e4;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_DATABASE_LONG_TEXT_FIELD_LENGTH = 1e5;
const MAX_DOCUMENT_COUNT_PER_QUERY = 1e2;
const PROJECT_RATING_MIN_VALUE = 1;
const PROJECT_RATING_MAX_VALUE = 5;

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  identifiers: { // List of identifiers. Created based on Project title on different languages
    type: Array,
    required: true,
    minlength: 0,
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  },
  identifier_languages: { // Principal language of each identifier. Default to en
    type: Object,
    default: {}
  },
  created_at: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: null,
    trim: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  search_name: { // Shadow search fields used for search queries. Includes translated values as well as real field, seperated by a space.
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_LONG_TEXT_FIELD_LENGTH
  },
  search_description: { // Shadow search fields used for search queries. Includes translated values as well as real field, seperated by a space.
    type: String,
    default: null,
    trim: true,
    maxlength: MAX_DATABASE_LONG_TEXT_FIELD_LENGTH
  },
  rating: {
    type: Number,
    default: null,
    min: PROJECT_RATING_MIN_VALUE,
    max: PROJECT_RATING_MAX_VALUE
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

ProjectSchema.statics.findProjectById = function (id, callback) {
  const Project = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Project.findById(mongoose.Types.ObjectId(id.toString()), (err, project) => {
    if (err) return callback('database_error');
    if (!project) return callback('document_not_found');

    return callback(null, project);
  });
};

ProjectSchema.statics.findProjectByIdentifierAndFormatByLanguage = function (identifier, language, callback) {
  const Project = this;

  Project.findOne({
    identifiers: identifier
  }, (err, project) => {
    if (err) return callback('database_error');
    if (!project)
      return callback('document_not_found');

    if (!project.is_completed)
      return callback('not_authenticated_request');

    if (!language || !ALLOWED_LANGUAGE_VALUES.includes(language))
      language = project.identifier_languages[identifier];

    getProjectByLanguage(project, language, (err, project) => {
      if (err) return callback(err);

      return callback(null, project);
    });
  });
};

ProjectSchema.statics.findProjectByIdAndFormat = function (id, callback) {
  const Project = this;

  Project.findProjectById(id, (err, project) => {
    if (err) return callback(err);

    getProject(project, (err, project) => {
      if (err) return callback(err);

      return callback(null, project);
    });
  });
};

ProjectSchema.statics.findProjectByIdAndFormatByLanguage = function (id, language, callback) {
  const Project = this;

  if (!language || !ALLOWED_LANGUAGE_VALUES.includes(language))
    return callback('bad_request');

  Project.findProjectById(id, (err, project) => {
    if (err) return callback(err);

    if (!project.is_completed)
      return callback('not_authenticated_request');

    getProjectByLanguage(project, language, (err, project) => {
      if (err) return callback(err);

      return callback(null, project);
    });
  });
};

ProjectSchema.statics.findProjectsByFilters = function (data, callback) {
  const Project = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {};

  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) > 0 && parseInt(data.limit) < MAX_DOCUMENT_COUNT_PER_QUERY ? parseInt(data.limit) : DEFAULT_DOCUMENT_COUNT_PER_QUERY;
  const page = data.page && !isNaN(parseInt(data.page)) && parseInt(data.page) > 0 ? parseInt(data.page) : 0;
  const skip = page * limit;

  if ('is_deleted' in data)
    filters.is_deleted = data.is_deleted ? true : false;

  if (data.name && typeof data.name == 'string' && data.name.trim().length && data.name.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.name = { $regex: data.name.trim(), $options: 'i' };

  if (!data.search || typeof data.search != 'string' || !data.search.trim().length) {
    Project
      .find(filters)
      .sort({ order: -1 })
      .limit(limit)
      .skip(skip)
      .then(projects => async.timesSeries(
        projects.length,
        (time, next) => Project.findProjectByIdAndFormat(projects[time]._id, (err, project) => next(err, project)),
        (err, projects) => {
          if (err) return callback(err);

          return callback(null, {
            search: null,
            limit,
            page,
            projects
          });
        })
      )
      .catch(_ => callback('database_error'));
  } else {
    filters.$text = { $search: data.search.trim() };

    Project
      .find(filters)
      .sort({
        score: { $meta: 'textScore' }, 
        order: -1
      })
      .limit(limit)
      .skip(skip)
      .then(projects => async.timesSeries(
        projects.length,
        (time, next) => Project.findProjectByIdAndFormat(projects[time]._id, (err, project) => next(err, project)),
        (err, projects) => {
          if (err) return callback(err);

          return callback(null, {
            search: data.search.trim(),
            limit,
            page,
            projects
          });
        })
      )
      .catch(_ => callback('database_error'));
  };
};

ProjectSchema.statics.findProjectCountByFilters = function (data, callback) {
  const Project = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {};

  if ('is_deleted' in data)
    filters.is_deleted = data.is_deleted ? true : false;

  if (data.name && typeof data.name == 'string' && data.name.trim().length && data.name.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.name = { $regex: data.name.trim(), $options: 'i' };

  if (!data.search || typeof data.search != 'string' || !data.search.trim().length) {
    Project
      .find(filters)
      .countDocuments()
      .then(count => callback(null, count))
      .catch(_ => callback('database_error'));
  } else {
    filters.$text = { $search: data.search.trim() };

    Project
      .find(filters)
      .countDocuments()
      .then(count => callback(null, count))
      .catch(_ => callback('database_error'));
  };
};

module.exports = mongoose.model('Project', ProjectSchema);
