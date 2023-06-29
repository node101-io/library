const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const xmljs = require('xml-js');

function formatNumberTo2Digits(number, addition) {
  if (isNaN(parseInt(number)))
    return '00';

  number = parseInt(number);

  if (addition)
    number++;

  if (number >= 10)
    return number.toString();
  if (number < 0)
    return '00';
  return `0${number}`;
};

function getToday() {
  return `${(new Date).getFullYear()}-${formatNumberTo2Digits((new Date).getMonth(), true)}-${formatNumberTo2Digits((new Date).getDate())}`;
};

module.exports = (req, res) => {
  return res.json({ success: true });
  // const domain = 'https://library.node101.io';
  // const xml = fs.readFileSync(path.join(__dirname, '../public/sitemap.xml'));
  // const file = xmljs.xml2js(xml, { compact: false });
  // const today = getToday();

  // fetch('https://admin.node101.io/sitemap')
  //   .then(res => res.json())
  //   .then(res => {
  //     console.log(res);
  //   })
  //   .catch(_ => callback('unknown_error'));
}