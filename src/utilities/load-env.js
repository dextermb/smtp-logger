const env = require('dotenv')
const path = require('path')
const dir = require('pkg-dir')

function handler () {
  env.config({
    path: path.join(dir.sync(__dirname), '.env')
  })
}

exports.load = handler
