const express = require('express');
const fs = require('fs');
const multer = require("multer")  

const getPathNode = require('./logic/getPathNode');
const parseVideoExtension = require('./logic/parseVideoExtension');
const saveFileInPaths = require('./logic/saveFileInPaths');
const paths = require('./paths');

const app = express();
const port = 3005;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'videos/');
  },
  filename: function (req, file, cb) {
    const extension = parseVideoExtension(file.mimetype);
    
    if (extension === null) return;
    
    const filename = `${file.fieldname}-${Date.now()}.${extension}`

    cb(null, filename);
  }
});

const upload = multer({storage});

// middleware for CORS

app.use((req, res, next) => {  
  const ACRHeaders = req.get('Access-Control-Request-Headers');

  if (ACRHeaders) {
    let allowHeaders = '';
    
    for (let header of ACRHeaders.split(',')) {
      if (header === "content-type") {
        allowHeaders += header;
      }
    }

    res.set('Access-Control-Allow-Headers', allowHeaders);
    
    if (req.get('Access-Control-Request-Method') === 'POST') {
      res.set('Access-Control-Allow-Methods', 'POST');
    }
  }

  res.set('Access-Control-Allow-Origin', '*');

  next();
});

// routes

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

app.post('/videos', upload.single('video'), (req, res) => {
  const virtualPath = req.query.path;
  
  saveFileInPaths(req.file, virtualPath, paths);

  res.status = 200;
  res.end();
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});