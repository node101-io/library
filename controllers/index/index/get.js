const DEFAULT_SLIDER_WRITING_COUNT = 5;
const DEFAULT_LOAD_WRITING_COUNT = 7;

const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;

  Writing.findWritingsByFiltersAndFormatByLanguage({
    limit: DEFAULT_SLIDER_WRITING_COUNT,
    label: 'slider'
  }, language, (err, slider_data) => {
    if (err) return res.redirect('/error?message=' + err);

    Writing.findWritingsByFiltersAndFormatByLanguage({
      limit: DEFAULT_LOAD_WRITING_COUNT,
      sort: 'created_at'
    }, language, (err, writings_data) => {
      if (err) return res.redirect('/error?message=' + err);
  
      return res.render('index/index', {
        page: 'index/index',
        title: res.__('Read, Listen & Watch'),
        includes: {
          external: {
            css: ['general', 'header', 'page', 'writing'],
            js: ['ancestorWithClassName', 'header', 'serverRequest']
          },
          // meta: {
          //   title: res.__('Read, Listen & Watch | library.node101'),
          //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
          //   image: '/res/images/open-graph/header.png',
          //   twitter: true
          // }
        },
        slider: slider_data.writings,
        writings: writings_data.writings
      });
    });
  });
};
