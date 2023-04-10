const fs = require('fs');

const DEFAULT_SLIDER_WRITING_COUNT = 5;
const DEFAULT_LOAD_WRITING_COUNT = 9;

const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  // const LOCAL = JSON.parse(fs.readFileSync('./local.json')).map(each => {
  //   each.social_media_accounts = {
  //     medium: 'https://usersmagic.com',
  //     spotify: 'https://usersmagic.com',
  //     youtube: 'https://usersmagic.com',
  //   }
  //   return each
  // }); // Use this JSON as arrays in the render function working locally

  const language = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  // return res.render('index/index', {
  //   page: 'index/index',
  //   title: res.__('Read, Listen & Watch'),
  //   includes: {
  //     external: {
  //       css: ['general', 'header', 'page'],
  //       js: ['ancestorWithClassName', 'header', 'serverRequest']
  //     },
  //     // meta: {
  //     //   title: res.__('Read, Listen & Watch | library.node101'),
  //     //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
  //     //   image: '/res/images/open-graph/header.png',
  //     //   twitter: true
  //     // }
  //   },
  //   slider: LOCAL,
  //   writings: LOCAL
  // });

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
            css: ['general', 'header', 'page'],
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

  // const MONTHS = [
  //   res.__('Jan'),
  //   res.__('Feb'),
  //   res.__('Mar'),
  //   res.__('Apr'),
  //   res.__('May'),
  //   res.__('Jun'),
  //   res.__('Jul'),
  //   res.__('Aug'),
  //   res.__('Sept'),
  //   res.__('Oct'),
  //   res.__('Nov'),
  //   res.__('Dec')
  // ];
  // const language = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  // Writing.findWritingsByFiltersAndFormatByLanguage({
  //   limit: DEFAULT_LOAD_BLOG_COUNT,
  //   label: 'slider'
  // }, language, (err, slider_data) => {
  //   if (err) return res.redirect('/error?message=' + err);

  //   Writing.findWritingsByFiltersAndFormatByLanguage({
  //     limit: DEFAULT_LOAD_BLOG_COUNT,
  //     sort: 'created_at'
  //   }, language, (err, trend_data) => {
  //     if (err) return res.redirect('/error?message=' + err);
  
  //     Writing.findWritingsByFiltersAndFormatByLanguage({
  //       limit: DEFAULT_LOAD_BLOG_COUNT,
  //       label: 'exlusive'
  //     }, language, (err, exclusive_data) => {
  //       if (err) return res.redirect('/error?message=' + err);
    
  //       Writing.findWritingsByFiltersAndFormatByLanguage({
  //         limit: DEFAULT_LOAD_BLOG_COUNT,
  //         sort: 'created_at'
  //       }, language, (err, latest_data) => {
  //         if (err) return res.redirect('/error?message=' + err);
      
  //         Writing.findWritingsByFiltersAndFormatByLanguage({
  //           limit: DEFAULT_LOAD_BLOG_COUNT,
  //           label: 'editors_pick'
  //         }, language, (err, editors_pick_data) => {
  //           if (err) return res.redirect('/error?message=' + err);
        
  //           return res.render('index/index', {
  //             page: 'index/index',
  //             title: res.__('Read, Listen & Watch'),
  //             includes: {
  //               external: {
  //                 css: ['aos', 'bootstrap.min', 'buttons', 'colors', 'events', 'font-awesome.min', 'font', 'footer', 'general', 'header', 'library', 'margin-padding', 'page', 'slider', 'style', 'swiper-bundle.min'],
  //                 js: ['jquery-1.11.2.min', 'jquery.counterup.min', 'jquery.waypoints.min', 'aos', 'big', 'bootstrap.min', 'public', 'swiper-bundle.min']
  //               },
  //               // meta: {
  //               //   title: res.__('Read, Listen & Watch | library.node101'),
  //               //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
  //               //   image: '/res/images/open-graph/header.png',
  //               //   twitter: true
  //               // }
  //             },
  //             page_id: 'library',
  //             language,
  //             MONTHS,
  //             slider: slider_data.writings,
  //             trend: trend_data.writings,
  //             exclusive: exclusive_data.writings,
  //             latest: latest_data.writings,
  //             editors_pick: editors_pick_data.writings,
  //           });
  //         });
  //       });
  //     });
  //   });
  // });
};
