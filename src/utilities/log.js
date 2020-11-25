const winston = require('winston')
const constants = require('../constants')

const handler = (
  winston.createLogger({
    level: 'silly',
    transports: [
      new winston.transports.Console({ format: winston.format.simple() }),
      new winston.transports.File({ filename: constants.PATH.LOGGER.ALL_PATH })
    ]
  })
)

module.exports = handler
