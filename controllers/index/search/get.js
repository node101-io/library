const WRITING_COUNT = 7;

const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;

  if (!req.query.search || typeof req.query.search != 'string' || !req.query.search.trim().length)
    return res.redirect('/');

  Writing.findWritingCountByFiltersAndLanguage({
    search: req.query.search,
    type: 'blog',
    do_not_load_content: true,
    do_not_load_writer: true
  }, language, (err, count) => {
    if (err) return res.redirect('/error?message=' + err);

    Writing.findWritingsByFiltersAndFormatByLanguage({
      search: req.query.search,
      limit: WRITING_COUNT,
      type: 'blog',
      do_not_load_content: true,
      do_not_load_writer: true
    }, language, (err, writings_data) => {
      if (err) return res.redirect('/error?message=' + err);
  
      return res.render('index/search', {
        page: 'index/search',
        title: writings_data.search + res.__(' - Search Results'),
        includes: {
          external: {
            css: ['general', 'header', 'navbar', 'page', 'writing'],
            js: ['ancestorWithClassName', 'header', 'navbar', 'page', 'serverRequest']
          },
          meta: {
            title: res.__('Read, Listen & Watch'),
            description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
            image: '/res/images/meta/header.png',
            twitter: true
          }
        },
        count,
        search: writings_data.search,
        writings: writings_data.writings
      });
    });
  });
};
