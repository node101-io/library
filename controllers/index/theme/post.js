module.exports = (req, res) => {
  if (!req.body.theme || (req.body.theme != 'dark' && req.body.theme != 'light'))
    return res.json({ success: false, error: 'bad_request' });

  req.session.theme = req.body.theme;

  return res.json({ success: true });
}