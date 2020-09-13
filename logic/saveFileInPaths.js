const fs = require('fs')

const saveFileInPaths = (file, virtualPath, paths) => {
  const pathStack = virtualPath.split('/');
  const filename = pathStack.pop();
  let folderPaths = paths;

  while (pathStack.length > 0) {
    folderPaths = folderPaths[pathStack.shift()].paths;
  }

  folderPaths[filename] = {
    type: file.mimetype,
    realPath: file.destination + file.filename,
    paths: null
  }

  fs.writeFile('paths.json', JSON.stringify(paths, null, 2), (err) => {
    if (err) {
      throw err;
    } else {
      console.log(`File ${file.filename} saved successfuly`);
    }
  });
};

module.exports = saveFileInPaths;