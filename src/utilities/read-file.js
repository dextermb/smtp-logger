const fs = require('fs')
const exists = require('./path-exists')

const handler = path => new Promise((resolve, reject) => (
  exists(path).then(does => (
    !does
      ? resolve('')
      : (
        fs.readFile(
          path, 'utf8',
          (err, data) => err ? reject(err) : resolve(data)
        )
      )
  ))
))

module.exports = handler
