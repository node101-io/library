const moment = require('moment-timezone');

const Blog = require('../../blog/Blog');
const Writer = require('../../writer/Writer');

module.exports = (writing, language, callback) => {
  let translation = writing.translations[language];

  if (!translation)
    translation = {
      title: writing.title.replace(writing._id.toString(), ''),
      subtitle: writing.subtitle,
      content: writing.content,
      flag: writing.flag,
      social_media_accounts: writing.social_media_accounts
    };

  Blog.findBlogByIdAndFormatByLanguage(writing.parent_id, language, (err, blog) => {
    if (err) return  callback(err);

    Writer.findWriterByIdAndFormatByLanguage(writing.writer_id, language, (err, writer) => {
      if (err) return callback(err);
  
      return callback(null, {
        _id: writing._id.toString(),
        title: translation.title.replace(writing._id.toString(), ''),
        link: `${blog.link}/${writing.identifiers.find(each => writing.identifier_languages[each] == language) || writing.identifiers[0]}`,
        blog,
        writer,
        created_at: moment(writing.created_at).format('DD[.]MM[.]YYYY'),
        logo: writing.logo,
        cover: writing.cover,
        subtitle: translation.subtitle,
        content: translation.content,
        label: writing.label,
        flag: translation.flag,
        social_media_accounts: translation.social_media_accounts
      });
    });
  });
};
