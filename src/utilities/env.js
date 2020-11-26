const env = require('dotenv')
const path = require('path')
const dir = require('pkg-dir')

exports.load = () => {
  env.config({
    path: path.join(dir.sync(__dirname), '.env')
  })
}

exports.get = key => process.env[key]

exports.isset = key => {
  if (typeof key === 'string') {
    const val = this.get(key)

    return val !== undefined && val !== null && val.length > 0
  }

  return false
}
