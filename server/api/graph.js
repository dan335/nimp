var ObjectId = require('mongodb').ObjectID;


module.exports = function(app) {
  app.post('/api/graph', (req, res, next) => {
    if (req.body.graphId.length != 24) {
      return res.status(500).end('Invalid graph id.');
    }

    const collection = req.app.locals.db.collection('graphs');
    const graphId = new ObjectId(req.body.graphId);

    collection.findOne({_id:graphId}, {}, (error, graph) => {
      if (error) {
        return res.status(500).end('Error finding graph.');
      } else {
        if (!graph) {
          res.status(404).end('No graph found.');
        } else {
          if (graph.isPublic) {
            res.json(graph).end();
          } else {
            if (graph.userId != req.body.userId) {
              return res.status(401).end('Not authorized.');
            } else {
              return res.json(graph).end();
            }
          }
        }
      }
    })
  })
}
