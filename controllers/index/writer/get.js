const urldecode = require('urldecode');

const Writer = require('../../../models/writer/Writer');
const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.language;
  const url = req.originalUrl.substring(1, req.originalUrl.length);
  const identifier = urldecode(url.split('?')[0]).replace('writer/', '');

  Writer.findWriterByIdenfierAndFormatByLanguage(identifier, language, (err, writer) => {
    if (err) return res.redirect('/');

    Writing.findWritingsByFiltersAndFormatByLanguage({
      writer_id: writer._id
    }, language, (err, data) => {
      if (err) return res.redirect('/');

      Writing.findWritingCountByFiltersAndLanguage({
        writer_id: writer._id
      }, language, (err, count) => {
        if (err) return res.redirect('/');

        return res.render('index/writer', {
          page: 'index/writer',
          title: writer.name,
          includes: {
            external: {
              css: ['general', 'header', 'info', 'page', 'writings'],
              js: ['ancestorWithClassName', 'header', 'serverRequest']
            },
            // meta: {
            //   title: res.__('Read, Listen & Watch | library.node101'),
            //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
            //   image: '/res/images/open-graph/header.png',
            //   twitter: true
            // }
          },
          writer,
          count,
          writings: data.writings,
          limit: data.limit,
          page: data.page
        });
      });
    });
  });
};