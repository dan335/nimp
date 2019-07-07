const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const expressApp = express();

  expressApp.use(bodyParser.json({limit: '20mb', extended: true}));
  expressApp.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

  expressApp.get('*', (req,res) => {
    return handle(req,res);
  })

  expressApp.listen(PORT, err => {
    if (err) throw err;
    console.log(`ready at http://localhost:${PORT}`)
  })
})
