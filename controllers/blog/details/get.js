const fs = require('fs');
const urldecode = require('urldecode');

const Blog = require('../../../models/blog/Blog');
const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const language = res.locals.lang;
  const url = urldecode(req.originalUrl.substring(1, req.originalUrl.length)).split('?')[0].replace('blog/', '');
  const blogIdentifier = url.split('/')[0];
  const writingIdentifier = url.split('/')[1];

  const LOCAL = JSON.parse(fs.readFileSync('./local.json'));

  Blog.findBlogByIdentifierAndFormatByLanguage(blogIdentifier, language, (err, blog) => {
    if (err) return res.redirect('/');

    if (!writingIdentifier)
      return res.render('blog/details', {
        page: 'blog/details',
        title: blog.name,
        includes: {
          external: {
            css: ['general', 'header', 'info', 'page', 'writing'],
            js: ['ancestorWithClassName', 'header', 'page', 'serverRequest']
          },
          // meta: {
          //   title: res.__('Read, Listen & Watch | library.node101'),
          //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
          //   image: '/res/images/open-graph/header.png',
          //   twitter: true
          // }
        },
        blog,
        count,
        writings: data.writings,
        writings_limit: data.limit,
        writings_page: data.page,
        slider: LOCAL,
        editors_pick: LOCAL.filter((_, i) => i < 5),
        writings: LOCAL,
        tags: [
          {
            name: 'Cosmos',
            url: '/'
          },
          {
            name: 'SUI',
            url: '/'
          },
          {
            name: 'Celestia',
            url: '/'
          },
          {
            name: 'NYM',
            url: '/'
          },
          {
            name: 'Haftalık',
            url: '/'
          },
          {
            name: 'Mutlu.Cosmos',
            url: '/'
          },
          {
            name: 'Mina',
            url: '/'
          },
          {
            name: 'En Yeniler',
            url: '/'
          },
          {
            name: 'DevCon',
            url: '/'
          },
          {
            name: 'ZK Special',
            url: '/'
          }
        ]
      });

    Writing.findWritingByIdentifierAndFormatByLanguage(writingIdentifier, language, (err, writing) => {
      if (err) return res.redirect('/');

      return res.render('blog/writing', {
        page: 'blog/writing',
        title: writing.title,
        includes: {
          external: {
            css: ['general', 'header', 'navbar', 'page', 'writing'],
          js: ['ancestorWithClassName', 'header', 'navbar', 'page', 'serverRequest']
          },
          // meta: {
          //   title: res.__('Read, Listen & Watch | library.node101'),
          //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
          //   image: '/res/images/open-graph/header.png',
          //   twitter: true
          // }
        },
        blog,
        writing
      });
    });
  });
}