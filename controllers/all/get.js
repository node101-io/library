const urldecode = require('urldecode');

const Blog = require('../../models/blog/Blog');
const Writing = require('../../models/writing/Writing');

module.exports = (req, res) => {
  const MONTHS = [
    res.__('Jan'),
    res.__('Feb'),
    res.__('Mar'),
    res.__('Apr'),
    res.__('May'),
    res.__('Jun'),
    res.__('Jul'),
    res.__('Aug'),
    res.__('Sept'),
    res.__('Oct'),
    res.__('Nov'),
    res.__('Dec')
  ];

  const url = req.originalUrl.substring(1, req.originalUrl.length);
  const blogIdentifier = urldecode(url.split('?')[0]).split('/')[0];
  const writingIdentifier = urldecode(url.split('?')[0]).split('/')[1];
  const language = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  Blog.findBlogByIdentifierAndFormatByLanguage(blogIdentifier, language, (err, blog) => {
    if (err) return res.redirect('/error?message=' + err);

    if (!writingIdentifier || !writingIdentifier.trim().length)
      return res.render('all/index', {
        page: 'all/index',
        title: blog.title,
        includes: {
          external: {
            css: ['aos', 'bootstrap.min', 'buttons', 'colors', 'events', 'font-awesome.min', 'font', 'footer', 'general', 'header', 'library', 'margin-padding', 'page', 'slider', 'style', 'swiper-bundle.min'],
            js: ['jquery-1.11.2.min', 'jquery.counterup.min', 'jquery.waypoints.min', 'aos', 'big', 'bootstrap.min', 'public', 'swiper-bundle.min']
          },
          // meta: {
          //   title: res.__('Read, Listen & Watch | library.node101'),
          //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
          //   image: '/res/images/open-graph/header.png',
          //   twitter: true
          // }
        },
        MONTHS,
        page_id: 'search',
        language,
        blog
      });

    Writing.findWritingByIdentifierAndFormatByLanguage(writingIdentifier, language, (err, writing) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.render('all/details', {
        page: 'all/details',
        title: writing.title,
        includes: {
          external: {
            css: ['aos', 'bootstrap.min', 'buttons', 'colors', 'events', 'font-awesome.min', 'font', 'footer', 'general', 'header', 'library', 'margin-padding', 'page', 'slider', 'style', 'swiper-bundle.min'],
            js: ['jquery-1.11.2.min', 'jquery.counterup.min', 'jquery.waypoints.min', 'aos', 'big', 'bootstrap.min', 'public', 'swiper-bundle.min']
          },
          // meta: {
          //   title: res.__('Read, Listen & Watch | library.node101'),
          //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
          //   image: '/res/images/open-graph/header.png',
          //   twitter: true
          // }
        },
        MONTHS,
        page_id: 'article',
        language,
        blog,
        writing
      });
    });
  });
}