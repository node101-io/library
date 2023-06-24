const PROJECTS_COUNT = 8;

const Blog = require('../../../models/blog/Blog');

module.exports = (req, res) => {
  const language = res.locals.lang;

  req.query.type = 'project';
  req.query.limit = PROJECTS_COUNT;

  Blog.findBlogsByFiltersAndFormatByLanguage(req.query, language, (err, data) => {
    if (err) return res.redirect('/');

    Blog.findBlogCountByFiltersAndLanguage(req.query, language, (err, count) => {
      if (err) return res.redirect('/');

      return res.render('projects/index', {
        page: 'projects/index',
        title: res.__('Projects'),
        includes: {
          external: {
            css: ['general', 'header', 'item', 'navbar', 'page', 'text'],
            js: ['ancestorWithClassName', 'header', 'item', 'navbar', 'page', 'serverRequest']
          },
          meta: {
            title: res.__('Projects'),
            description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
            image: '/img/meta/header.png',
            twitter: true
          }
        },
        url: '/projects',
        active_header: 'projects',
        count,
        projects: data.blogs,
        projects_limit: data.limit,
        projects_page: data.page
      });
    });
  });
}