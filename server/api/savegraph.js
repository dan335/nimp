var ObjectId = require('mongodb').ObjectID;
const functions = require('../functions.js');


module.exports = function(app) {
  app.post('/api/savegraph', (req, res, next) => {
    if (req.session && req.session.user) {
      const collection = req.app.locals.db.collection('graphs');
      const graphId = new ObjectId(req.body.graph.id);
      const slug = functions.stringToSlug(req.body.graph.title.trim());

      collection.updateOne({_id: graphId}, {
        $set: {
          updatedAt: new Date(),
          graph: req.body.graph,
          title: req.body.graph.title.trim(),
          slug: slug
        },
        $setOnInsert: {
          createdAt: new Date(),
          _id: graphId,
          username: req.session.user.username,
          userId: req.session.user._id
        }
      }, {upsert:true}, (error, result) => {
        if (error) {
          res.status(500).end();
        } else {
          res.json({
            _id: req.body.graph.id,
            title: req.body.graph.title.trim(),
            slug: slug
          }).end();
        }
      })
    } else {
      res.status(500).end('Account required to save graphs.');
    }
  })
}
