const getPathNode = (path, paths) => {
  if (path.length === 0) return paths;
  
  const pathStack = path.split('/');
  let currentNode = paths[pathStack[0]];

  for (let depth = 1; depth < pathStack.length; depth++) {
    currentNode = currentNode.paths[pathStack[depth]];
  }

  return currentNode;
};

module.exports = getPathNode;