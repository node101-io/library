const Tag = require('../../../models/tag/Tag');

module.exports = (req, res) => {
  const language = res.locals.lang;

  Tag.findTagsByFiltersAndFormatByLanguage({}, language, (err, data) => {
    if (err) return res.json({ success: false, error: err } );

    req.session.navbar_data_tags = data.tags;
    req.session.navbar_last_update_time = (new Date).getTime();

    return res.json({ success: true, tags: data.tags });
  });
};