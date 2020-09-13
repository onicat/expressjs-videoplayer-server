const parseVideoExtension = (mimeType) => {
  switch(mimeType) {
    case 'video/mp4': return 'mp4';
    case 'video/mpeg': return 'mpeg';
    case 'video/ogg': return 'ogg';
    default: return null;
  }
};

module.exports = parseVideoExtension;