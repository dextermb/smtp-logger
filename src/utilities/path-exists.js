const fs = require('fs')

const handler = path => new Promise(resolve => (
  fs.stat(path, err => err ? resolve(false) : resolve(true))
))

module.exports = handler
