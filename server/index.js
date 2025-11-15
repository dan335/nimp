const express = require("express");
const path = require("path");
const next = require("next");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
console.log("PORT", PORT);
const MongoClient = require("mongodb").MongoClient;
const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/nimp";

const mongoClient = new MongoClient(MONGO_URL, {
  serverSelectionTimeoutMS: 10000,
});

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);

// const uri = process.env.MONGO_URL;
// const options = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   tls: true,
//   tlsCAFile: process.env.MONGO_CERT_PATH
// }

//let mongoClient = new MongoClient(uri, options)
//let clientPromise = mongoClient.connect()

console.log("Connecting to Mongo...");
mongoClient.connect((error) => {
  if (error) {
    console.error("Error connecting to mongodb.", error);
    process.exit(1); // fail fast so you see the error
  }

  console.log("Preparing Next...");
  nextApp
    .prepare()
    .then(() => {
      console.log("Next prepared");
      const expressApp = express();

      expressApp.locals.db = mongoClient.db("nimp");

      //expressApp.locals.db.createIndex("users", { email: 1 });
      expressApp.locals.db
        .collection("users")
        .createIndex({ email: 1 })
        .then(() => console.log("Ensured users.email index"))
        .catch((e) => console.warn("Index creation warning:", e.message || e));

      // let store = new MongoStore({
      //   clientPromise: clientPromise,
      //   collection: "sessions",
      // });

      let store = new MongoStore({
        uri: MONGO_URL,
        collection: "sessions",
        // databaseName: "nimp", // only needed if your URI has no /db at the end
      });

      store.on("error", function (error) {
        console.log("MongoStore Error", error);
      });

      expressApp.use(
        session({
          secret: "workhard",
          store: store,
          cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
          resave: false,
          saveUninitialized: false,
        }),
      );

      expressApp.use(bodyParser.json({ limit: "20mb" }));
      expressApp.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

      require("./api/savegraph.js")(expressApp);
      require("./api/createaccount.js")(expressApp);
      require("./api/login.js")(expressApp);
      require("./api/logout.js")(expressApp);
      require("./api/graph.js")(expressApp);
      require("./api/graphs.js")(expressApp);
      require("./api/deletegraph.js")(expressApp);

      expressApp.get("*", (req, res) => {
        return handle(req, res);
      });

      expressApp.listen(PORT, (err) => {
        if (err) throw err;
        console.log(`Nimp running on port ${PORT}`);
      });

      // // delete graphs not viewed in the past 30 days
      // setInterval(() => {
      //   const collection = expressApp.locals.db.collection('graphs');
      //   const cutoff = new Date(new Date().setDate(new Date().getDate()-90));
      //   collection.deleteMany({viewedAt: {$lt:cutoff}});
      // }, 1000 * 60 * 60 * 6);
    })
    .catch((err) => {
      console.error("Next prepare failed:", err);
      process.exit(1);
    });
});
