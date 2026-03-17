const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient, ObjectId } = require('mongodb');

let mongod;
let mongoClient;
let db;
let app;

async function setupTestApp() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  mongoClient = new MongoClient(uri);
  await mongoClient.connect();
  db = mongoClient.db('nimp_test');

  app = express();
  app.locals.db = db;

  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
  }));

  // Restore ObjectId types after session deserialization
  app.use((req, res, next) => {
    if (req.session && req.session.user && req.session.user._id && typeof req.session.user._id === 'string') {
      req.session.user._id = new ObjectId(req.session.user._id);
    }
    next();
  });

  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

  // Load API routes
  require('../../server/api/createaccount.js')(app);
  require('../../server/api/login.js')(app);
  require('../../server/api/logout.js')(app);
  require('../../server/api/savegraph.js')(app);
  require('../../server/api/deletegraph.js')(app);
  require('../../server/api/graph.js')(app);
  require('../../server/api/graphs.js')(app);

  return app;
}

async function teardownTestApp() {
  if (mongoClient) await mongoClient.close();
  if (mongod) await mongod.stop();
}

function getDb() {
  return db;
}

module.exports = { setupTestApp, teardownTestApp, getDb };
