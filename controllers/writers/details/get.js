const urldecode = require('urldecode');

const Writer = require('../../../models/writer/Writer');
const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;
  const url = req.originalUrl.substring(1, req.originalUrl.length);
  const identifier = urldecode(url.split('?')[0]).replace('writers', '');

  Writer.findWriterByIdenfierAndFormatByLanguage(identifier, language, (err, writer) => {
    if (err) return res.redirect('/writers');

    Writing.findWritingCountByFiltersAndLanguage({
      writer_id: writer._id
    }, language, (err, count) => {
      if (err) return res.redirect('/writers');

      return res.render('writers/details', {
        page: 'writers/details',
        title: writer.name,
        includes: {
          external: {
            css: ['confirm', 'general', 'header', 'info', 'navbar', 'page', 'writing'],
            js: ['ancestorWithClassName', 'cookies', 'createConfirm', 'header', 'navbar', 'page', 'serverRequest', 'writing']
          },
          meta: {
            title: writer.name,
            description: writer.title,
            image: '/img/meta/header.png',
            twitter: true
          }
        },
        url: writer.link,
        count,
        writer
      });
    });
  });
};