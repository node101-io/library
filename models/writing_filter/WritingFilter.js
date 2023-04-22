const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const toURLString = require('../../utils/toURLString');


const ALLOWED_LANGUAGE_VALUES = ['en', 'tr', 'ru'];
const DEFAULT_LANGUAGE = 'en';
const DEFAULT_DOCUMENT_COUNT_PER_QUERY = 10;
const LABEL_VALUES = ['slider', 'editors_pick', 'exclusive'];
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e5;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const MAX_DATABASE_LONG_TEXT_FIELD_LENGTH = 1e5;
const MAX_DOCUMENT_COUNT_PER_QUERY = 1e2;

const Schema = mongoose.Schema;

const WritingFilterSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  type: {
    type: String,
    required: true
  },
  parent_id: { // ID of a type from TYPE_VALUES
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

  if (!language || !ALLOWED_LANGUAGE_VALUES.includes(language))
    return callback('bad_request');

  Writing.findWritingById(id, (err, writing) => {
    if (err) return callback(err);

    if (!writing.is_completed)
      return callback('not_authenticated_request');

    getWritingByLanguage(writing, language, (err, writing) => {
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
    
  if (!data || typeof data != 'object')
    return callback('bad_request');

  if (!language || !ALLOWED_LANGUAGE_VALUES.includes(language))
    return callback('bad_request');

  const filters = {
    label: "slider",
    is_completed: true,
    is_deleted: false
  };

  // if (language == DEFAULT_LANGUAGE)
  //   filters.$and.push({ is_hidden: false })
  // else
  //   filters.$and.push({ $or: [ { is_hidden: true }, { is_hidden: false } ] });

  // for (let i = 1; i < ALLOWED_LANGUAGE_VALUES.length; i++)
  //   if (ALLOWED_LANGUAGE_VALUES[i] == language)
  //     filters.$and.push({ ['translations.' + ALLOWED_LANGUAGE_VALUES[i] + '.is_hidden']: false });
  //   else
  //     filters.$and.push({ $or: [ { ['translations.' + ALLOWED_LANGUAGE_VALUES[i] + '.is_hidden']: true, ['translations.' + ALLOWED_LANGUAGE_VALUES[i] + '.is_hidden']: false } ] });

  // if (data.label && LABEL_VALUES.includes(data.label))
  //   filters.$and.push({ label: data.label });
  // else {
  //   const labelOrArray = [];

  //   for (let i = 0; i < LABEL_VALUES.length; i++)
  //     labelOrArray.push({ label: LABEL_VALUES[i] });
    
  //   filters.$and.push({ $or: labelOrArray });
  // }

  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) > 0 && parseInt(data.limit) < MAX_DOCUMENT_COUNT_PER_QUERY ? parseInt(data.limit) : DEFAULT_DOCUMENT_COUNT_PER_QUERY;
  const page = data.page && !isNaN(parseInt(data.page)) && parseInt(data.page) > 0 ? parseInt(data.page) : 0;
  const skip = page * limit;

  // if (data.parent_id && validator.isMongoId(data.parent_id.toString()))
  //   filters.parent_id = mongoose.Types.ObjectId(data.parent_id.toString());

  // if (data.writer_id && validator.isMongoId(data.writer_id.toString()))
  //   filters.writer_id = mongoose.Types.ObjectId(data.writer_id.toString());

  if (!data.search || typeof data.search != 'string' || !data.search.trim().length) {
    console.log(JSON.stringify(filters))
    Writing
      .find({
        label: "slider",
        is_completed: true,
        is_deleted: false
      })
      // .sort({ order: -1 })
      .explain()
      .limit(limit)
      .skip(skip)
      .then(explanation => {
        console.log(explanation);

        Writing
          .find(filters)
          .sort({ order: -1 })
          .limit(limit)
          .skip(skip)
          .then(writings => async.timesSeries(
            writings.length,
            (time, next) => Writing.findWritingByIdAndFormatByLanguage(writings[time]._id, language, (err, writing) => next(err, writing)),
            (err, writings) => {
              if (err) return callback(err);

              return callback(null, {
                search: null,
                limit,
                page,
                writings
              });
            })
        )
        .catch(_ => callback('database_error'));
      })
      .catch(_ => callback('database_error'));
  } else {
    filters.$text = { $search: data.search.trim() };

    Writing
      .find(filters)
      .sort({
        score: { $meta: 'textScore' }, 
        created_at: -1
      })
      .limit(limit)
      .skip(skip)
      .explain()
      .then(explanation => {
        console.log(explanation)

        Writing
          .find(filters)
          .sort({
            score: { $meta: 'textScore' }, 
            created_at: -1
          })
          .limit(limit)
          .skip(skip)
          .then(writings => async.timesSeries(
            writings.length,
            (time, next) => Writing.findWritingByIdAndFormatByLanguage(writings[time]._id, language, (err, writing) => next(err, writing)),
            (err, writings) => {
              if (err) return callback(err);

              return callback(null, {
                search: data.search.trim(),
                limit,
                page,
                writings
              });
            })
      )
      .catch(_ => callback('database_error'));
      })
      .catch(_ => callback('database_error'));
  }
};

WritingSchema.statics.findWritingCountByFiltersAndLanguage = function (data, language, callback) {
  const Writing = this;

  if (!data || typeof data != 'object')
    return callback('bad_request');

  const filters = {
    is_completed: true,
    is_deleted: { $ne: true }
  };

  if (language == DEFAULT_LANGUAGE)
    filters.is_hidden = { $ne: true };
  else
    filters[language + '.is_hidden'] = { $ne: true };

  if (data.title && typeof data.title == 'string' && data.title.trim().length && data.title.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH) {
    if (language == DEFAULT_LANGUAGE)
     filters.title = { $regex: data.title.trim(), $options: 'i' };
    else
      filters[language + '.title'] = { $regex: data.title.trim(), $options: 'i' };
  }

  if (data.label && LABEL_VALUES.includes(data.label))
    filters.label = data.label;

  if (data.flag && typeof data.flag == 'string' && data.flag.trim().length && data.flag.trim().length < MAX_DATABASE_TEXT_FIELD_LENGTH) {
    if (language == DEFAULT_LANGUAGE)
      filters.flag = data.flag.trim();
    else
      filters[language + '.flag'] = data.flag.trim();
  }

  if (data.parent_id && validator.isMongoId(data.parent_id.toString()))
    filters.parent_id = mongoose.Types.ObjectId(data.parent_id.toString());

  if (data.writer_id && validator.isMongoId(data.writer_id.toString()))
    filters.writer_id = mongoose.Types.ObjectId(data.writer_id.toString());

  if (!data.search || typeof data.search != 'string' || !data.search.trim().length) {
    Writing
      .find(filters)
      .countDocuments()
      .then(count => callback(null, count))
      .catch(_ => callback('database_error'));
  } else {
    filters.$text = { $search: data.search.trim() };

    Writing
      .find(filters)
      .countDocuments()
      .then(count => callback(null, count))
      .catch(_ => callback('database_error'));
  };
};

module.exports = mongoose.model('Writing', WritingSchema);
