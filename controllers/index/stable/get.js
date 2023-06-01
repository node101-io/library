const urldecode = require('urldecode');

const Blog = require('../../../models/blog/Blog');
const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const id = urldecode(req.originalUrl.substring(1, req.originalUrl.length)).split('?')[0].replace('stable', '').split('/').join('');
  const language = res.locals.lang;

  Writing.findWritingByIdAndFormatByLanguage(id, language, (err, writing) => {
    if (err && err != 'document_not_found')
      return res.redirect('/error?message=' + err);

    if (writing) return res.redirect(writing.link);

    Blog.findBlogByIdAndFormatByLanguage(id, language, (err, blog) => {
      if (err) return res.redirect('/error?message=' + err);

      return res.redirect(blog.link);
    });
  });
};