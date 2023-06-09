const moment = require('moment-timezone');

const Writer = require('../../writer/Writer');

const formatContent = require('./formatContent');

module.exports = (writing, language, options, callback) => {
  let translation = writing.translations[language];

  if (!translation)
    translation = {};
  if (!translation.title || !translation.title.length)
    translation.title = writing.title;
  if (!translation.parent_title || !translation.parent_title.length)
    translation.parent_title = writing.parent_title;
  if (!translation.subtitle || !translation.subtitle.length)
    translation.subtitle = writing.subtitle
  if (!formatContent(translation.content) || !formatContent(translation.content).length)
    translation.content = formatContent(writing.content);
  if (!translation.flag || !translation.flag.length)
    translation.flag = writing.flag;
  if (!translation.social_media_accounts || typeof translation.social_media_accounts != 'object')
    translation.social_media_accounts = {};
  Object.keys(writing.social_media_accounts).forEach(key => {
    if (!translation.social_media_accounts[key])
      translation.social_media_accounts[key] = writing.social_media_accounts[key];
  });

  const blog = {
    title: translation.parent_title,
    image: writing.parent_image,
    identifier: writing.parent_identifiers.find(each => writing.parent_identifier_languages[each] == language) || writing.parent_identifiers[0],
    link: `blog/${writing.parent_identifiers.find(each => writing.parent_identifier_languages[each] == language) || writing.parent_identifiers[0]}${options.query_lang ? '?lang=' + options.query_lang : ''}`,
  };

  if (options.do_not_load_blog) {
    if (options.do_not_load_writer) {
      return callback(null, {
        _id: writing._id.toString(),
        title: translation.title.replace(writing._id.toString(), ''),
        link: `/stable/${writing._id.toString()}${options.query_lang ? '?lang=' + options.query_lang : ''}`,
        blog: {},
        writer: {},
        created_at: moment(writing.created_at).format('DD[.]MM[.]YYYY'),
        logo: writing.logo,
        cover: writing.cover,
        subtitle: translation.subtitle,
        content: options.do_not_load_content ? '' : formatContent(translation.content),
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
          link: `/stable/${writing._id.toString()}${options.query_lang ? '?lang=' + options.query_lang : ''}`,
          blog: {},
          writer,
          created_at: moment(writing.created_at).format('DD[.]MM[.]YYYY'),
          logo: writing.logo,
          cover: writing.cover,
          subtitle: translation.subtitle,
          content: options.do_not_load_content ? '' : formatContent(translation.content),
          label: writing.label,
          flag: translation.flag,
          social_media_accounts: translation.social_media_accounts
        });
      });
    }
  } else {
    if (options.do_not_load_writer) {
      return callback(null, {
        _id: writing._id.toString(),
        title: translation.title.replace(writing._id.toString(), ''),
        link: `/blog/${blog.identifier}/${writing.identifiers.find(each => writing.identifier_languages[each] == language) || writing.identifiers[0]}${options.query_lang ? '?lang=' + options.query_lang : ''}`,
        blog,
        writer: {},
        created_at: moment(writing.created_at).format('DD[.]MM[.]YYYY'),
        logo: writing.logo,
        cover: writing.cover,
        subtitle: translation.subtitle,
        content: options.do_not_load_content ? '' : formatContent(translation.content),
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
          link: `/blog/${blog.identifier}/${writing.identifiers.find(each => writing.identifier_languages[each] == language) || writing.identifiers[0]}${options.query_lang ? '?lang=' + options.query_lang : ''}`,
          blog,
          writer,
          created_at: moment(writing.created_at).format('DD[.]MM[.]YYYY'),
          logo: writing.logo,
          cover: writing.cover,
          subtitle: translation.subtitle,
          content: options.do_not_load_content ? '' : formatContent(translation.content),
          label: writing.label,
          flag: translation.flag,
          social_media_accounts: translation.social_media_accounts
        });
      });
    }
  }
};
