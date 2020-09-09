const express = require('express');

const paths = require('./paths');

const app = express();
const port = 3005;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/paths', (req, res) => {
  res.status = '200';
  res.send(JSON.stringify(paths));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});