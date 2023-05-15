const urldecode = require('urldecode');

const Blog = require('../../../models/blog/Blog');
const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;
  const url = urldecode(req.originalUrl.substring(1, req.originalUrl.length)).split('?')[0].replace('blog/', '');
  const blogIdentifier = url.split('/')[0];
  const writingIdentifier = url.split('/')[1];

  Blog.findBlogByIdentifierAndFormatByLanguage(blogIdentifier, language, (err, blog) => {
    if (err) return res.redirect('/');

    if (!writingIdentifier)
      return res.render('blog/details', {
        page: 'blog/details',
        title: blog.title,
        includes: {
          external: {
            css: ['general', 'header', 'navbar', 'page', 'writing'],
            js: ['ancestorWithClassName', 'header', 'navbar', 'page', 'serverRequest']
          },
          meta: {
            title: res.__('Read, Listen & Watch'),
            description: blog.subtitle,
            image: '/res/images/meta/header.png',
            twitter: true
          }
        },
        blog
      });

    Writing.findWritingByIdentifierAndFormatByLanguage(writingIdentifier, language, (err, writing) => {
      if (err) return res.redirect('/');

      return res.render('blog/writing', {
        page: 'blog/writing',
        title: writing.title,
        includes: {
          external: {
            css: ['general', 'header', 'navbar', 'page', 'writing'],
            js: ['ancestorWithClassName', 'header', 'navbar', 'page', 'serverRequest']
          },
          meta: {
            title: writing.title,
            description: writing.subtitle,
            image: '/res/images/meta/header.png',
            twitter: true
          }
        },
        blog,
        writing
      });
    });
  });
}