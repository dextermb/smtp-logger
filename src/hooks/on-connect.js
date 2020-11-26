const log = require('../utilities/log')

const handler = (session, callback) => {
  log.info('onConnect')

  callback()
}

module.exports = handler
