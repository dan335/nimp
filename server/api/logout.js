module.exports = function(app) {
  app.get('/api/logout', (req, res, next) => {
    delete req.session.user;
    res.status(200).end();
  })
}
