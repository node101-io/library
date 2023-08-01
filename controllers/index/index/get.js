// const fs = require('fs');

const SLIDER_WRITING_COUNT = 5;
const WRITING_COUNT = 7;

const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;
  const query_lang = res.locals.query_lang;

  Writing.findWritingsByFiltersAndFormatByLanguage({
    limit: SLIDER_WRITING_COUNT,
    label: 'slider',
    do_not_load_content: true,
    do_not_load_writer: true,
    query_lang
  }, language, (err, slider_data) => {
    if (err) return res.redirect('/error?message=' + err);

    Writing.findWritingsByFiltersAndFormatByLanguage({
      limit: WRITING_COUNT,
      do_not_load_content: true,
      do_not_load_writer: true,
      query_lang
    }, language, (err, writings_data) => {
      if (err) return res.redirect('/error?message=' + err);
  
      return res.render('index/index', {
        page: 'index/index',
        title: res.__('Read, Listen & Watch'),
        includes: {
          external: {
            css: ['confirm', 'general', 'header', 'navbar', 'page', 'writing'],
            js: ['ancestorWithClassName', 'cookies', 'createConfirm', 'header', 'navbar', 'page', 'serverRequest', 'writing']
          },
          meta: {
            title: res.__('Read, Listen & Watch'),
            description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
            image: '/img/meta/header.png',
            twitter: true
          }
        },
        url: '/',
        slider: slider_data.writings,
        writings: writings_data.writings
      });
    });
  });
};
