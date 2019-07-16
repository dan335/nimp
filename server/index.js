const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const MongoClient = require('mongodb').MongoClient;
const mongoClient = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true });
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

mongoClient.connect(error => {
  if (error) {
    console.log('Error connecting to mongodb at '+process.env.MONGO_URL+'.');
    console.log(error);
    return;
  }

  nextApp.prepare().then(() => {
    const expressApp = express();

    expressApp.locals.db = mongoClient.db('nimp');

    expressApp.locals.db.createIndex('users', {email:1});

    const store = new MongoStore({
      uri: process.env.MONGO_URL + '/nimp',
      collection: 'sessions'
    }, error => {
      if (error) {
        console.log('new MongoStore error', error);
      }
    });

    store.on('error', function(error) {
      console.log('MongoStore Error', error);
    });

    expressApp.use(session({
      secret: 'workhard',
      store: store,
      cookie: {maxAge: 1000*60*60*24*30},
      resave: false,
      saveUninitialized: false
    }));

    expressApp.use(bodyParser.json({limit: '20mb', extended: true}));
    expressApp.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

    require('./api/savegraph.js')(expressApp);
    require('./api/createaccount.js')(expressApp);
    require('./api/login.js')(expressApp);
    require('./api/logout.js')(expressApp);
    require('./api/graph.js')(expressApp);

    expressApp.get('*', (req,res) => {
      return handle(req,res);
    })

    expressApp.listen(PORT, err => {
      if (err) throw err;
      console.log(`Nimp running on port ${PORT}`);
    })

    // delete graphs not viewed in the past 30 days
    setInterval(() => {
      const collection = expressApp.locals.db.collection('graphs');
      const cutoff = new Date(new Date().setDate(new Date().getDate()-90));
      collection.deleteMany({viewedAt: {$lt:cutoff}});
    }, 1000 * 60 * 60 * 6);
  })
})
