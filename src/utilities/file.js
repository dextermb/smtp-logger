const fs = require('fs')
const util = require('util')
const { dirname } = require('path')

const d = require('make-dir')
const w = util.promisify(fs.writeFile)
const a = util.promisify(fs.appendFile)

exports.exists = path => new Promise(resolve => (
  fs.stat(path, err => err ? resolve(false) : resolve(true))
))

exports.read = path => new Promise((resolve, reject) => (
  this.exists(path)
    .then(does => (
      !does
        ? reject(new Error('Invalid file path.'))
        : fs.readFile(path, 'utf8', (_, data) => resolve(data))
    ))
))

exports.write = async (path, content, append = false) => {
  // Make directory
  await d(dirname(path))

  if (append) {
    // Append to file
    await a(path, content)
  } else {
    // Write to file
    await w(path, content)
  }
}

exports.json = async path => {
  if (await this.exists(path)) {
    const raw = await this.read(path)

    try {
      return JSON.parse(raw)
    } catch (e) {
      return false
    }
  }

  return false
}
