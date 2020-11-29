const winston = require('winston')
const constants = require('../constants')

const handler = (
  winston.createLogger({
    level: 'silly',
    transports: [
      new winston.transports.Console({
        format: winston.format.simple()
      }),
      new winston.transports.File({
        filename: constants.PATH.STORAGE.LOGS,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        )
      })
    ]
  })
)

module.exports = handler
