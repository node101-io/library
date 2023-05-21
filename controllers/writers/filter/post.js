const WRITERS_COUNT = 7;

const Writer = require('../../../models/writer/Writer');

module.exports= (req, res) => {
  const language = res.locals.language;

  req.body.limit = WRITERS_COUNT;

  Writer.findWritersByFiltersAndFormatByLanguage(req.body, language, (err, writers_data) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({
      success: true,
      search: writers_data.search,
      limit: writers_data.limit,
      page: writers_data.page,
      writers: writers_data.writers
    });
  });
};