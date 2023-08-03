// const FIVE_MINS_IN_MS = 5 * 60 * 1000;
const FIVE_MINS_IN_MS = 0;

module.exports = (req, res, next) => {
  if (
    req.session &&
    req.session.navbar_data_editors_pick &&
    req.session.navbar_data_tags &&
    req.session.navbar_data_exclusive &&
    req.session.navbar_last_update_time &&
    (new Date).getTime() - req.session.navbar_last_update_time < FIVE_MINS_IN_MS
  ) {
    res.locals.navbar_loaded = true;
    res.locals.editors_pick = req.session.navbar_data_editors_pick;
    res.locals.tags = req.session.navbar_data_tags;
    res.locals.exclusive = req.session.navbar_data_exclusive;
  }

  return next();
};