const EDITORS_PICK_WRITING_COUNT = 5;
const EXCLUSIVE_WRITING_COUNT = 5;

const Tag = require('../models/tag/Tag');
const Writing = require('../models/writing/Writing');

module.exports = (req, res, next) => {
  const language = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  Tag.findTagsByFiltersAndFormatByLanguage({}, language, (err, tags_data) => {
    if (err) return res.redirect('/error?message=' + err);

    Writing.findWritingsByFiltersAndFormatByLanguage({
      limit: EDITORS_PICK_WRITING_COUNT,
      label: 'editors_pick',
      do_not_load_content: true,
      do_not_load_blog: true,
      do_not_load_writer: true
    }, language, (err, editors_pick_data) => {
      if (err) return res.redirect('/error?message=' + err);
  
      Writing.findWritingsByFiltersAndFormatByLanguage({
        limit: EXCLUSIVE_WRITING_COUNT,
        label: 'exclusive',
        do_not_load_content: true,
        do_not_load_blog: true,
        do_not_load_writer: true
      }, language, (err, exclusive_data) => {
        if (err) return res.redirect('/error?message=' + err);
    
        res.locals.tags = tags_data.tags;
        res.locals.editors_pick = editors_pick_data.writings;
        res.locals.exclusive = exclusive_data.writings;

        return next();
      });
    });
  });
};