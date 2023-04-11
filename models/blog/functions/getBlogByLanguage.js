const Project = require('../../project/Project');
const Writer = require('../../writer/Writer');

module.exports = (blog, language, callback) => {
  let translation = blog.translations[language];

  if (!translation)
    translation = {};
  if (!translation.title || !translation.title.length)
    translation.title = blog.title;
  if (!translation.subtitle || !translation.subtitle.length)
    translation.subtitle = blog.subtitle;
  Object.keys(blog.social_media_accounts).forEach(key => {
    if (!translation.social_media_accounts[key])
      translation.social_media_accounts[key] = blog.social_media_accounts[key];
  });
    

  if (blog.type == 'project') {
    Project.findProjectByIdAndFormatByLanguage(blog.project_id, language, (err, project) => {
      if (err) return callback(err);

      Writer.findWriterByIdAndFormatByLanguage(blog.writer_id, language, (err, writer) => {
        if (err) return callback(err);

        return callback(null, {
          _id: blog._id.toString(),
          title: translation.title.replace(blog._id.toString(), ''),
          link: `/projects/${blog.identifiers.find(each => blog.identifier_languages[each] == language) || blog.identifiers[0]}`,
          type: blog.type,
          project,
          writer,
          subtitle: translation.subtitle,
          image: blog.image,
          social_media_accounts: translation.social_media_accounts,
          is_completed: blog.is_completed
        });
      });
    });
  } else {
    Writer.findWriterByIdAndFormatByLanguage(blog.writer_id, language, (err, writer) => {
      if (err) return callback(err);

      return callback(null, {
        _id: blog._id.toString(),
        title: translation.title.replace(blog._id.toString(), ''),
        link: `/projects/${blog.identifiers.find(each => blog.identifier_languages[each] == language) || blog.identifiers[0]}`,
        type: blog.type,
        project: null,
        writer,
        subtitle: translation.subtitle,
        image: blog.image,
        social_media_accounts: translation.social_media_accounts,
        is_completed: blog.is_completed
      });
    });
  };
};