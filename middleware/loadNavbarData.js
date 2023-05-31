const EDITORS_PICK_WRITING_COUNT = 5;
const EXCLUSIVE_WRITING_COUNT = 5;
const FIVE_MINS_IN_MS = 5 * 60 * 1000;

const Tag = require('../models/tag/Tag');
const Writing = require('../models/writing/Writing');

module.exports = (req, res, next) => {
  const language = res.locals.lang;

  if (
    req.session &&
    req.session.navbar_data &&
    req.session.navbar_last_update_time &&
    (new Date).getTime() - req.session.navbar_last_update_time < FIVE_MINS_IN_MS
  ) {
    const navbar = JSON.parse(req.session.navbar_data);

    res.locals.tags = navbar.tags;
    res.locals.editors_pick = navbar.editors_pick;
    res.locals.exclusive = navbar.exclusive;

    return next();
  } else {
    Tag.findTagsByFiltersAndFormatByLanguage({}, language, (err, tags_data) => {
      if (err) return res.redirect('/error?message=' + err);
  
      Writing.findWritingsByFiltersAndFormatByLanguage({
        limit: EDITORS_PICK_WRITING_COUNT,
        label: 'editors_pick',
        type: 'blog',
        do_not_load_content: true,
        do_not_load_blog: true,
        do_not_load_writer: true
      }, language, (err, editors_pick_data) => {
        if (err) return res.redirect('/error?message=' + err);
    
        Writing.findWritingsByFiltersAndFormatByLanguage({
          limit: EXCLUSIVE_WRITING_COUNT,
          label: 'exclusive',
          type: 'blog',
          do_not_load_content: true,
          do_not_load_blog: true,
          do_not_load_writer: true
        }, language, (err, exclusive_data) => {
          if (err) return res.redirect('/error?message=' + err);

          req.session.navbar_data = JSON.stringify({
            tags: tags_data.tags,
            editors_pick: editors_pick_data.writings,
            exclusive: exclusive_data.writings
          });
          req.session.navbar_last_update_time = (new Date).getTime();
      
          res.locals.tags = tags_data.tags;
          res.locals.editors_pick = editors_pick_data.writings;
          res.locals.exclusive = exclusive_data.writings;
  
          return next();
        });
      });
    });
  }
};