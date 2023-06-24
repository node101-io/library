const WRITERS_COUNT = 7;

const Writer = require('../../../models/writer/Writer');

module.exports = (req, res) => {
  const language = res.locals.lang;
  const query_lang = res.locals.query_lang;

  req.query.limit = WRITERS_COUNT;
  req.query.query_lang = query_lang;

  Writer.findWritersByFiltersAndFormatByLanguage(req.query, language, (err, data) => {
    if (err) return res.redirect('/');

    Writer.findWriterCountByFiltersAndLanguage(req.query, language, (err, count) => {
      if (err) return res.redirect('/');

      return res.render('writers/index', {
        page: 'writers/index',
        title: res.__('Our Writers'),
        includes: {
          external: {
            css: ['general', 'header', 'item', 'navbar', 'page', 'text'],
            js: ['ancestorWithClassName', 'header', 'item', 'navbar', 'page', 'serverRequest']
          },
          meta: {
            title: res.__('Our Writers'),
            description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
            image: '/img/meta/header.png',
            twitter: true
          }
        },
        url: '/writers',
        active_header: 'writers',
        count,
        writers: data.writers,
        writers_limit: data.limit,
        writers_page: data.page
      });
    });
  });
}