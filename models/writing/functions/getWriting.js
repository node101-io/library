const moment = require('moment-timezone');

const Blog = require('../../blog/Blog');
const Writer = require('../../writer/Writer');

module.exports = (writing, callback) => {
  Blog.findBlogByIdAndFormat(writing.parent_id, (err, blog) => {
    if (err) return callback(err);

    Writer.findWriterByIdAndFormat(writing.writer_id, (err, writer) => {
      if (err) return callback(err);
  
      return callback(null, {
        _id: writing._id.toString(),
        title: writing.title.replace(writing._id.toString(), ''),
        link: `/${blog.identifier}/${writing.identifiers[0]}`,
        blog,
        created_at: moment(writing.created_at).format('DD[.]MM[.]YYYY'),
        writer,
        subtitle: writing.subtitle,
        logo: writing.logo,
        cover: writing.cover,
        content: writing.content,
        label: writing.label,
        flag: writing.flag,
        social_media_accounts: writing.social_media_accounts
      });
    });
  });
};
