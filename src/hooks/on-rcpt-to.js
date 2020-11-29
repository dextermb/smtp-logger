const log = require('../utilities/log')

const handler = (address, session, callback) => {
  log.debug('onRcptTo')

  callback()
}

module.exports = handler
