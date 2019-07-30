var ObjectId = require('bson-objectid');


module.exports = function(app) {
  app.get('/api/graphs', (req, res, next) => {
    const collection = req.app.locals.db.collection('graphs');
    const cursor = collection.find({isPublic:true}, {sort:{updatedAt:-1}, projection:{userId:1, username:1, views:1, thumbnail:1, title:1, url:1}});
    cursor.toArray((error, graphs) => {
      if (error) {
        console.log(error);
        res.status(500).end();
      } else {
        res.json(graphs).end();
      }
    })
  })


  app.post('/api/usergraphs', (req, res, next) => {
    const collection = req.app.locals.db.collection('graphs');

    if (req.body.userId.length != 24) {
      return res.status(500).end();
    }

    const userId = new ObjectId(req.body.userId);

    let find = {userId:userId};

    if (!req.body.isUser) {
      find.isPublic = true;
    }

    const cursor = collection.find(find, {sort:{updatedAt:-1}, projection:{userId:1, username:1, views:1, thumbnail:1, title:1, url:1}});
    cursor.toArray((error, graphs) => {
      if (error) {
        console.log(error);
        res.status(500).end();
      } else {
        res.json(graphs).end();
      }
    })
  })
}
