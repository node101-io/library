const moment = require('moment-timezone');

const Blog = require('../../blog/Blog');
const Writer = require('../../writer/Writer');

module.exports = (writing, language, options, callback) => {
  let translation = writing.translations[language];

  if (!translation)
    translation = {};
  if (!translation.title || !translation.title.length)
    translation.title = writing.title;
  if (!translation.subtitle || !translation.subtitle.length)
    translation.subtitle = writing.subtitle
  if (!translation.content || !translation.content.length)
    translation.content = writing.content;
  if (!translation.flag || !translation.flag.length)
    translation.flag = writing.flag;
  Object.keys(writing.social_media_accounts).forEach(key => {
    if (!translation.social_media_accounts[key])
      translation.social_media_accounts[key] = writing.social_media_accounts[key];
  });

  if (options.do_not_load_blog) {
    if (options.do_not_load_writer) {
      return callback(null, {
        _id: writing._id.toString(),
        title: translation.title.replace(writing._id.toString(), ''),
        link: `/blog/stable/${writing._id.toString()}`,
        blog: {},
        writer: {},
        created_at: moment(writing.created_at).format('DD[.]MM[.]YYYY'),
        logo: writing.logo,
        cover: writing.cover,
        subtitle: translation.subtitle,
        content: options.do_not_load_content ? '' : translation.content,
        label: writing.label,
        flag: translation.flag,
        social_media_accounts: translation.social_media_accounts
      });
    } else {
      Writer.findWriterByIdAndFormatByLanguage(writing.writer_id, language, (err, writer) => {
        if (err) return callback(err);
    
        return callback(null, {
          _id: writing._id.toString(),
          title: translation.title.replace(writing._id.toString(), ''),
          link: `/blog/stable/${writing._id.toString()}`,
          blog: {},
          writer,
          created_at: moment(writing.created_at).format('DD[.]MM[.]YYYY'),
          logo: writing.logo,
          cover: writing.cover,
          subtitle: translation.subtitle,
          content: options.do_not_load_content ? '' : translation.content,
          label: writing.label,
          flag: translation.flag,
          social_media_accounts: translation.social_media_accounts
        });
      });
    }
  } else {
    if (options.do_not_load_writer) {
      Blog.findBlogByIdAndFormatByLanguage(writing.parent_id, language, (err, blog) => {
        if (err) return  callback(err);
    
        return callback(null, {
          _id: writing._id.toString(),
          title: translation.title.replace(writing._id.toString(), ''),
          link: `/blog/${blog.identifier}/${writing.identifiers.find(each => writing.identifier_languages[each] == language) || writing.identifiers[0]}`,
          blog,
          writer: {},
          created_at: moment(writing.created_at).format('DD[.]MM[.]YYYY'),
          logo: writing.logo,
          cover: writing.cover,
          subtitle: translation.subtitle,
          content: options.do_not_load_content ? '' : translation.content,
          label: writing.label,
          flag: translation.flag,
          social_media_accounts: translation.social_media_accounts
        });
      });
    } else {
      Blog.findBlogByIdAndFormatByLanguage(writing.parent_id, language, (err, blog) => {
        if (err) return  callback(err);
    
        Writer.findWriterByIdAndFormatByLanguage(writing.writer_id, language, (err, writer) => {
          if (err) return callback(err);
      
          return callback(null, {
            _id: writing._id.toString(),
            title: translation.title.replace(writing._id.toString(), ''),
            link: `/blog/${blog.identifier}/${writing.identifiers.find(each => writing.identifier_languages[each] == language) || writing.identifiers[0]}`,
            blog,
            writer,
            created_at: moment(writing.created_at).format('DD[.]MM[.]YYYY'),
            logo: writing.logo,
            cover: writing.cover,
            subtitle: translation.subtitle,
            content: options.do_not_load_content ? '' : translation.content,
            label: writing.label,
            flag: translation.flag,
            social_media_accounts: translation.social_media_accounts
          });
        });
      });
    }
  }
};