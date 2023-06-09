module.exports = (writer, language, options, callback) => {
  let translation = writer.translations[language];

  if (!translation)
    translation = {};
  if (!translation.title)
    translation.title = writer.title;
  if (!translation.social_media_accounts)
    translation.social_media_accounts = {};
  Object.keys(writer.social_media_accounts).forEach(key => {
    if (!translation.social_media_accounts[key])
      translation.social_media_accounts[key] = writer.social_media_accounts[key];
  });

  return callback(null, {
    _id: writer._id.toString(),
    is_completed: writer.is_completed,
    name: writer.name.replace(writer._id.toString(), ''),
    link: `/writers${writer.link}${options.query_lang ? '?lang=' + options.query_lang : ''}`,
    title: translation.title,
    image: writer.image,
    social_media_accounts: translation.social_media_accounts
  });
}  