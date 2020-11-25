const fs = require('fs')

exports.exists = path => new Promise(resolve => (
  fs.stat(path, err => err ? resolve(false) : resolve(true))
))

exports.read = path => new Promise((resolve, reject) => (
  this.exists(path).then(does => (
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
