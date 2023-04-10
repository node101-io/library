const urldecode = require('urldecode');

const Blog = require('../../../models/blog/Blog');
const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.language;
  const url = req.originalUrl.substring(1, req.originalUrl.length);
  const identifier = urldecode(url.split('?')[0]).replace('blog/', '');

  Blog.findBlogByIdenfierAndFormatByLanguage(identifier, language, (err, blog) => {
    if (err) return res.redirect('/');

    Writing.findWritingsByFiltersAndFormatByLanguage({
      parent_id: blog._id
    }, language, (err, data) => {
      if (err) return res.redirect('/');

      Writing.findWritingCountByFiltersAndLanguage({
        parent_id: blog._id
      }, language, (err, count) => {
        if (err) return res.redirect('/');

        return res.render('index/blog', {
          page: 'index/blog',
          title: blog.name,
          includes: {
            external: {
              css: ['general', 'header', 'info', 'page', 'writings'],
              js: ['ancestorWithClassName', 'header', 'serverRequest']
            },
            // meta: {
            //   title: res.__('Read, Listen & Watch | library.node101'),
            //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
            //   image: '/res/images/open-graph/header.png',
            //   twitter: true
            // }
          },
          blog,
          count,
          writings: data.writings,
          limit: data.limit,
          page: data.page
        });
      });
    });
  });
};