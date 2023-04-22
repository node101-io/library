const urldecode = require('urldecode');

const Blog = require('../../../models/blog/Blog');
const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;
  const url = req.originalUrl.substring(1, req.originalUrl.length);
  const identifier = urldecode(url.split('?')[0]).replace('projects/', '');

  Blog.findBlogByIdentifierAndFormatByLanguage(identifier, language, (err, project) => {
    if (err) return res.redirect('/projects');

    Writing.findWritingsByFiltersAndFormatByLanguage({
      parent_id: project._id
    }, language, (err, data) => {
      if (err) return res.redirect('/projects');

      Writing.findWritingCountByFiltersAndLanguage({
        parent_id: project._id
      }, language, (err, count) => {
        if (err) return res.redirect('/projects');

        return res.render('projects/details', {
          page: 'projects/details',
          title: project.name,
          includes: {
            external: {
              css: ['general', 'header', 'info', 'page', 'writing'],
              js: ['ancestorWithClassName', 'header', 'page', 'serverRequest']
            },
            // meta: {
            //   title: res.__('Read, Listen & Watch | library.node101'),
            //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
            //   image: '/res/images/open-graph/header.png',
            //   twitter: true
            // }
          },
          project,
          count,
          writings: data.writings,
          writings_limit: data.limit,
          writings_page: data.page
        });
      });
    });
  });
};