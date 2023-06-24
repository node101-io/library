const WRITING_COUNT = 7;

const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;
  const query_lang = res.locals.query_lang;

  Writing.findWritingsByFiltersAndFormatByLanguage({
    limit: WRITING_COUNT,
    label: 'exclusive',
    type: 'blog',
    do_not_load_content: true,
    do_not_load_writer: true,
    query_lang
  }, language, (err, writings_data) => {
    if (err) return res.redirect('/error?message=' + err);

    return res.render('index/exclusive', {
      page: 'index/exclusive',
      title: res.__('Exclusive Content'),
      includes: {
        external: {
          css: ['general', 'header', 'navbar', 'page', 'writing'],
          js: ['ancestorWithClassName', 'header', 'navbar', 'page', 'serverRequest', 'writing']
        },
        meta: {
          title: res.__('Exclusive Content'),
          description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
          image: '/img/meta/header.png',
          twitter: true
        }
      },
      url: '/exclusive',
      writings: writings_data.writings
    });
  });
};
