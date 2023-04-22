const urldecode = require('urldecode');

const Blog = require('../../models/blog/Blog');
const Writing = require('../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;
  const url = req.originalUrl.substring(1, req.originalUrl.length);
  const blogIdentifier = urldecode(url.split('?')[0]).split('/')[0];
  const writingIdentifier = urldecode(url.split('?')[0]).split('/')[1];

  Blog.findBlogByIdentifierAndFormatByLanguage(blogIdentifier, language, (err, blog) => {
    if (err) return res.redirect('/');

    Writing.findWritingByIdentifierAndFormatByLanguage(writingIdentifier, language, (err, writing) => {
      if (err) return res.redirect('/');

      return res.render('all/details', {
        page: 'all/details',
        title: writing.title,
        includes: {
          external: {
            css: ['general', 'header', 'page'],
            js: ['ancestorWithClassName', 'header', 'page', 'serverRequest']
          },
          // meta: {
          //   title: res.__('Read, Listen & Watch | library.node101'),
          //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
          //   image: '/res/images/open-graph/header.png',
          //   twitter: true
          // }
        },
        blog,
        writing
      });
    });
  });
}