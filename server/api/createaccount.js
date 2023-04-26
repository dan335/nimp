const bcrypt = require('bcryptjs');


module.exports = function(app) {
  app.post('/api/createaccount', (req, res, next) => {

    if (!req.body.username || !req.body.username.length) {
      return res.status(500).send('Username required.');
    }

    if (!req.body.email || !req.body.email.length) {
      return res.status(500).send('Email required.');
    }

    if (req.body.email.length >= 255) {
      return res.status(500).send('Email must be less than 255 characters.');
    }

    let username = req.body.username.replace(/[^0-9a-zA-Z._\s]/g, '').trim();
    let usernameNoSpaces = username.replace(/\s/g, '');

    if (usernameNoSpaces.length >= 28) {
      return res.status(500).send('Username must be less than 28 characters.  Special characters are removed.');
    }

    if (!usernameNoSpaces.length) {
      return res.status(500).send('Username required.  Special characters are removed.');
    }

    if (!req.body.password1 || !req.body.password1.length) {
      return res.status(500).send('Password required.');
    }

    if (!req.body.password2 || !req.body.password2.length) {
      return res.status(500).send('Password required.');
    }

    if (req.body.password1 != req.body.password2) {
      return res.status(500).send('Passwords do not match.');
    }

    const collection = req.app.locals.db.collection('users');

    collection.findOne({email:req.body.email.toLowerCase().trim()}, {}, (error, result) => {
      if (error) {
        return res.status(500).send('Database error.');
      } else {
        if (result) {
          return res.status(500).send('A user with this email already exists.');
        } else {

          bcrypt.hash(req.body.password1, 10, (error, hash) => {
            if (error) {
              return res.status(500).send('Error hashing password.');
            } else {
              const data = {
                username: req.body.username.trim(),
                email: req.body.email.toLowerCase().trim(),
                createdAt: new Date(),
                password: hash
              };

              collection.insertOne(data, {}, (error, result) => {
                if (error) {
                  return res.status(500).send('Error inserting user into db.');
                } else {
                  data._id = result.insertedId;
                  req.session.user = data;
                  res.status(200).end();
                }
              })
            }
          })
        }
      }
    })
  })
}
