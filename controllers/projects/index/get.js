const Blog = require('../../../models/blog/Blog');

module.exports = (req, res) => {
  const language = res.locals.lang;
  req.query.type = 'project';

  Blog.findBlogsByFiltersAndFormatByLanguage(req.query, language, (err, data) => {
    if (err) return res.redirect('/');

    Blog.findBlogCountByFiltersAndLanguage(req.query, language, (err, count) => {
      if (err) return res.redirect('/');

      return res.render('projects/index', {
        page: 'projects/index',
        title: res.__('Projects'),
        includes: {
          external: {
            css: ['general', 'header', 'info', 'item', 'text', 'page'],
            js: ['ancestorWithClassName', 'header', 'page', 'serverRequest']
          },
          // meta: {
          //   title: res.__('Read, Listen & Watch | library.node101'),
          //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
          //   image: '/res/images/open-graph/header.png',
          //   twitter: true
          // }
        },
        count,
        projects: data.blogs,
        projects_limit: data.limit,
        projects_page: data.page
      });
    });
  });
}