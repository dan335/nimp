const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true });
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

mongoClient.connect(error => {
  if (error) {
    console.log('Error connecting to mongodb at '+process.env.MONGO_URL+'.');
    console.log(error);
    return;
  }

  nextApp.prepare().then(() => {
    const expressApp = express();

    expressApp.locals.db = mongoClient.db('nimp');

    expressApp.use(bodyParser.json({limit: '20mb', extended: true}));
    expressApp.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

    expressApp.get('*', (req,res) => {
      return handle(req,res);
    })

    expressApp.listen(PORT, err => {
      if (err) throw err;
      console.log(`Nimp running on port ${PORT}`);
    })
  })
})
