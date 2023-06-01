const PROJECTS_COUNT = 8;

const Blog = require('../../../models/blog/Blog');

module.exports= (req, res) => {
  const language = res.locals.lang;

  req.body.type = 'project';
  req.body.limit = PROJECTS_COUNT;

  Blog.findBlogsByFiltersAndFormatByLanguage(req.body, language, (err, blogs_data) => {
    if (err) return res.json({ success: false, error: err });

    return res.json({
      success: true,
      search: blogs_data.search,
      limit: blogs_data.limit,
      page: blogs_data.page,
      projects: blogs_data.blogs
    });
  });
};