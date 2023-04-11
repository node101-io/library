const Writer = require('../../../models/writer/Writer');

module.exports = (req, res) => {
  const language = res.locals.lang;

  Writer.findWritersByFiltersAndFormatByLanguage(req.query, language, (err, data) => {
    if (err) return res.redirect('/');

    Writer.findWriterCountByFiltersAndLanguage(req.query, language, (err, count) => {
      if (err) return res.redirect('/');

      return res.render('writers/index', {
        page: 'writers/index',
        title: res.__('Our Writers'),
        includes: {
          external: {
            css: ['general', 'header', 'info', 'item', 'text', 'page'],
            js: ['ancestorWithClassName', 'header', 'page', 'serverRequest']
          },
          // meta: {
          //   title: res.__('Read, Listen & Watch | library.node101'),
          //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
          //   image: '/res/images/open-graph/header.png',
          //   twitter: true
          // }
        },
        count,
        writers: data.writers,
        writers_limit: data.limit,
        writers_page: data.page
      });
    });
  });
}