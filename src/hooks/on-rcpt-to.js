const log = require('../utilities/log')

const handler = (address, session, callback) => {
  log.info('onRcptTo')

  callback()
}

module.exports = handler
