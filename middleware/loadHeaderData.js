const LIBRARY_BLOG_COUNT = 9;
const LIBRARY_WRITING_COUNT = 9;

const Blog = require('../models/blog/Blog');
const Writing = require('../models/writing/Writing');

module.exports = (req, res, next) => {
  const language = req.query.lang ? req.query.lang : (req.headers['accept-language'] ? req.headers['accept-language'].split('-')[0] : 'en');

  Blog.findBlogsByFiltersAndFormatByLanguage({
    type: 'project',
    limit: LIBRARY_BLOG_COUNT
  }, language, (err, projects_data) => {
    if (err) return next();

    Blog.findBlogsByFiltersAndFormatByLanguage({
      type: 'terms',
      limit: LIBRARY_BLOG_COUNT
    }, language, (err, terms_data) => {
      if (err) return next();
  
      Blog.findBlogsByFiltersAndFormatByLanguage({
        type: 'node101',
        limit: LIBRARY_BLOG_COUNT
      }, language, (err, news_data) => {
        if (err) return next();

        Writing.findWritingsByFiltersAndFormatByLanguage({
          sort: 'created_at',
          limit: LIBRARY_WRITING_COUNT
        }, language, (err, writings_data) => {
          if (err) return next();

          res.locals.header_library = {
            projects: projects_data.blogs.map(each => {
              return {
                link: each.link,
                title: each.title
              };
            }),
            terms: terms_data.blogs.map(each => {
              return {
                link: each.link,
                title: each.title
              };
            }),
            news: news_data.blogs.map(each => {
              return {
                link: each.link,
                title: each.title
              };
            }),
            writings: writings_data.writings.map(each => {
              return {
                link: each.link,
                logo: each.logo,
                title: each.title,
                subtitle: each.subtitle
              };
            })
          };

          return next();
        });
      });
    });
  });
}