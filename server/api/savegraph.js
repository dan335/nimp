var ObjectId = require('mongodb').ObjectID;
const functions = require('../functions.js');


module.exports = function(app) {

  app.post('/api/viewgraph', (req, res, next) => {
    const collection = req.app.locals.db.collection('graphs');
    const graphId = new ObjectId(req.body.graphId);
    collection.updateOne({_id:graphId}, {$set:{viewedAt:new Date()}, $inc:{views:1}});
    res.status(200).end();
  })



  app.post('/api/copygraph', (req, res, next) => {
    if (req.session && req.session.user) {
      const collection = req.app.locals.db.collection('graphs');
      const oldGraphId = new ObjectId(req.body.graph.id);
      const slug = functions.stringToSlug(req.body.graph.title.trim());

      collection.findOne({_id:oldGraphId}, {}, (error, graph) => {
        if (error) {
          res.status(500).end('Error finding graph.');
        } else {
          if (graph) {
            graph.graph = req.body.graph;
            graph.isPublic = req.body.isPublic;
            graph.anyoneCanOverwrite = req.body.anyoneCanOverwrite;
            graph._id = new ObjectId();
            graph.graph.id = graph._id.toHexString();
            graph.url = '/'+graph._id.toHexString()+'/'+slug;
            graph.createdAt = new Date();
            graph.updatedAt = new Date();
            graph.viewedAt = new Date();
            graph.userId = req.session.user._id;
            graph.username = req.session.user.username;
            graph.thumbnail = req.body.thumbnail;
            graph.views = 0;

            collection.insertOne(graph, {}, (error, result) => {
              if (error) {
                res.status(500).end('Error inserting new graph.');
              } else {
                res.json({
                  _id: graph._id.toHexString(),
                  title: graph.title,
                  slug: slug,
                  userId: graph.userId.toHexString()
                }).end();
              }
            })
          } else {
            res.status(500).end('Graph not found.');
          }
        }
      })
    }
  })


  app.post('/api/savegraph', (req, res, next) => {
    if (req.session && req.session.user) {
      const collection = req.app.locals.db.collection('graphs');
      const graphId = new ObjectId(req.body.graph.id);
      const slug = functions.stringToSlug(req.body.graph.title.trim());

      collection.findOne({_id:graphId}, {}, (error, graph) => {
        if (error) {
          res.status(500).end('Error finding graph.');
        } else {
          if (graph) {
            if (graph.anyoneCanOverwrite || graph.userId.toHexString() == req.session.user._id.toHexString()) {

              // anyone
              let set = {
                updatedAt: new Date(),
                graph: req.body.graph,
                thumbnail: req.body.thumbnail
              };

              // only owner
              if (graph.userId.toHexString() == req.session.user._id.toHexString()) {
                set.isPublic = req.body.isPublic;
                set.anyoneCanOverwrite = req.body.anyoneCanOverwrite;
                set.title = req.body.graph.title.trim();
                set.url = '/'+req.body.graph.id+'/'+slug;
                set.slug = slug;
              }

              // update graph
              collection.updateOne({_id:graphId}, {$set: set}, {}, (error, result) => {
                if (error) {
                  res.status(500).end('Error updating graph.');
                } else {
                  res.json({
                    _id: req.body.graph.id,
                    title: req.body.graph.title.trim(),
                    slug: slug,
                    userId: graph.userId
                  }).end();
                }
              });
            } else {
              res.status(500).end('Not allowed to save graph.');
            }
          } else {
            // create new graph
            collection.insertOne({
              updatedAt: new Date(),
              graph: req.body.graph,
              title: req.body.graph.title.trim(),
              url: '/'+req.body.graph.id+'/'+slug,
              slug: slug,
              isPublic: req.body.isPublic,
              anyoneCanOverwrite: req.body.anyoneCanOverwrite,
              createdAt: new Date(),
              viewedAt: new Date(),
              _id: graphId,
              username: req.session.user.username,
              userId: req.session.user._id,
              thumbnail: req.body.thumbnail,
              views: 0
            }, {}, (error, result) => {
              if (error) {
                res.status(500).end('Error inserting graph.');
              } else {
                res.json({
                  _id: req.body.graph.id,
                  title: req.body.graph.title.trim(),
                  slug: slug,
                  userId: req.session.user._id
                }).end();
              }
            })
          }
        }
      })
    } else {
      res.status(500).end('Account required to save graphs.');
    }
  })
}
