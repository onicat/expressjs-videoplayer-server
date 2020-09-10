const express = require('express');
const fs = require('fs');
const getPathNode = require('./logic/getPathNode');

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

app.get('/videos', (req, res) => {
  const path = req.query.path;
  const {realPath, type} = getPathNode(path, paths)
  const totalFileSize = fs.statSync(realPath).size;

  const range = req.headers.range; 
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : totalFileSize - 1;
  const chunkSize = (end-start) + 1;
  const readStream = fs.createReadStream(realPath, {start, end});

  res.writeHead(206, {
    "Content-Range": "bytes " + start + "-" + end + "/" + totalFileSize, 
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": type
  });
  
  readStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});