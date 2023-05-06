const FIVE_MIN_IN_MILISECONDS = 5 * 60 * 1000;

const Writing = require('../../models/writing/Writing');

module.exports = (req, res) => {
  if (
    req.session.navbar &&
    req.session.navbar_last_update_time &&
    req.session.navbar_last_update_time + FIVE_MIN_IN_MILISECONDS > (new Date()).getTime()
  )
    return res.json({ success: true, navbar: req.session.navbar });

  
}