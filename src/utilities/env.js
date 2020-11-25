const env = require('dotenv')
const path = require('path')
const dir = require('pkg-dir')

const file = require('./file')

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

exports.open = async key => {
  if (this.isset(key)) {
    if (await file.exists(this.get(key))) {
      const raw = await file.read(this.get(key))

      try {
        return JSON.parse(raw)
      } catch (e) {
        return false
      }
    }
  }

  return false
}
