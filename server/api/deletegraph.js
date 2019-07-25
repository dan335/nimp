var ObjectId = require('bson-objectid');


module.exports = function(app) {
  app.post('/api/deletegraph', (req, res, next) => {
    if (!req.session.user) {
      return res.status(500).end();
    }

    if (req.body.graphId.length != 24) {
      return res.status(500).end();
    }

    const graphId = new ObjectId(req.body.graphId);

    const collection = req.app.locals.db.collection('graphs');

    collection.deleteOne({userId:req.session.user._id, _id:graphId}, {}, (error, result) => {
      if (error) {
        res.status(500).end();
      } else {
        res.status(200).end();
      }
    })
  })
}
