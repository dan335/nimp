const bcrypt = require('bcryptjs');


module.exports = function(app) {
  app.post('/api/login', (req, res, next) => {
    if (!req.body.email || !req.body.email.length) {
      return res.status(500).send('Email address required.');
    }

    if (!req.body.password || !req.body.password.length) {
      return res.status(500).send('Password required.');
    }

    const collection = req.app.locals.db.collection('users');

    collection.findOne({email:req.body.email.toLowerCase().trim()}, {}, (error, user) => {
      if (error) {
        return res.status(500).send('Error finding user.');
      } else {
        if (user) {

          bcrypt.compare(req.body.password, user.password, (error, result) => {
            if (error) {
              return res.status(500).send('Error comparing passwords.');
            } else {
              if (result == true) {
                req.session.user = user;
                return res.status(200).end();
              } else {
                return res.status(500).send('Wrong password.');
              }
            }
          })
        } else {
          return res.status(500).send('Email not found.');
        }
      }
    })
  })
}
