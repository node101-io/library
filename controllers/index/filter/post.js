const WRITING_COUNT = 5;

const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;
  const query_lang = res.locals.query_lang;

  req.body.language = language;
  req.body.query_lang = query_lang;
  req.body.type = 'blog';
  req.body.limit = WRITING_COUNT;
  req.body.do_not_load_content = true;
  req.body.do_not_load_writer = true;

  Writing.findWritingsByFiltersAndFormatByLanguage(req.body, language, (err, writings_data) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({
      success: true,
      search: writings_data.search,
      limit: writings_data.limit,
      page: writings_data.page,
      writings: writings_data.writings
    });
  });
};
