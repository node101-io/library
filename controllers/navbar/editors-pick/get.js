const EDITORS_PICK_WRITING_COUNT = 5;

const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;

  Writing.findWritingsByFiltersAndFormatByLanguage({
    limit: EDITORS_PICK_WRITING_COUNT,
    label: 'editors_pick',
    type: 'blog',
    do_not_load_content: true,
    do_not_load_blog: true,
    do_not_load_writer: true
  }, language, (err, data) => {
    if (err) return res.json({ success: false, error: err } );

    req.session.navbar_data_editors_pick = data.writings;
    req.session.navbar_last_update_time = (new Date).getTime();

    return res.json({ success: true, writings: data.writings });
  });
}