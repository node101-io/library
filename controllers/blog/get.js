const urldecode = require('urldecode');

const Blog = require('../../models/blog/Blog');
const Writing = require('../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;

  const url = urldecode(req.originalUrl.substring(1, req.originalUrl.length)).split('?')[0].replace('blog/', '');
  const blogIdentifier = url.split('/')[0];
  const writingIdentifier = url.split('/')[1];

  Blog.findBlogByIdentifierAndFormatByLanguage(blogIdentifier, language, (err, blog) => {
    if (err) return res.redirect('/');

    if (!writingIdentifier) {
      Writing.findWritingCountByFiltersAndLanguage({
        parent_id: blog._id,
      }, language, (err, count) => {
        if (err) return res.redirect('/');

        return res.render('blog/details', {
          page: 'blog/details',
          title: blog.title,
          includes: {
            external: {
              css: ['confirm', 'general', 'header', 'info', 'navbar', 'writing'],
              js: ['ancestorWithClassName', 'cookies', 'createConfirm', 'header', 'navbar', 'page', 'serverRequest', 'writing']
            },
            meta: {
              title: blog.title,
              description: blog.subtitle,
              image: '/img/meta/header.png',
              twitter: true
            }
          },
          url: blog.link,
          count,
          blog
        });
      });
    } else {
      Writing.findWritingByIdentifierAndFormatByLanguage(writingIdentifier, language, (err, writing) => {
        if (err) return res.redirect('/');
  
        return res.render('blog/writing', {
          page: 'blog/writing',
          title: writing.title,
          includes: {
            external: {
              css: ['confirm', 'general', 'header', 'jetBrainsMono', 'navbar', 'page', 'writing'],
              js: ['ancestorWithClassName', 'cookies', 'createConfirm', 'header', 'navbar', 'page', 'serverRequest', 'writing']
            },
            meta: {
              title: writing.title,
              description: writing.subtitle,
              image: '/img/meta/header.png',
              twitter: true
            }
          },
          url: writing.link,
          blog,
          writing
        });
      });
    }
  });
}