const fs = require('fs');

const DEFAULT_SLIDER_WRITING_COUNT = 5;
const DEFAULT_LOAD_WRITING_COUNT = 7;

const Writing = require('../../../models/writing/Writing');

module.exports = (req, res) => {
  const LOCAL = JSON.parse(fs.readFileSync('./local.json'));
  const language = res.locals.lang;

  return res.render('index/index', {
    page: 'index/index',
    title: res.__('Read, Listen & Watch'),
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

  Writing.findWritingsByFiltersAndFormatByLanguage({
    limit: DEFAULT_SLIDER_WRITING_COUNT,
    label: 'slider'
  }, language, (err, slider_data) => {
    if (err) return res.redirect('/error?message=' + err);

    Writing.findWritingsByFiltersAndFormatByLanguage({
      limit: DEFAULT_LOAD_WRITING_COUNT
    }, language, (err, writings_data) => {
      if (err) return res.redirect('/error?message=' + err);
  
      return res.render('index/index', {
        page: 'index/index',
        title: res.__('Read, Listen & Watch'),
        includes: {
          external: {
            css: ['general', 'header', 'page', 'writing'],
            js: ['ancestorWithClassName', 'header', 'serverRequest']
          },
          // meta: {
          //   title: res.__('Read, Listen & Watch | library.node101'),
          //   description: res.__('Stake your assets with the industry\'s most user-friendly organization! node101 accompanies you on your staking journey from start to finish and offers a privileged service where you can safely stake your assets and get support from experts whenever you want.'),
          //   image: '/res/images/open-graph/header.png',
          //   twitter: true
          // }
        },
        slider: slider_data.writings,
        writings: writings_data.writings
      });
    });
  });
};
