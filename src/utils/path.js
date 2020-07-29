const path = require('path')
// return absolute path
function getAbsolutePath (uri) {
  return path.isAbsolute(uri) ? uri : path.resolve('src/config', uri)
}

module.exports = getAbsolutePath