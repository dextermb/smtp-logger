const log = require('../utilities/log')

const handler = (address, session, callback) => {
  log.debug('onMailFrom')

  callback()
}

module.exports = handler
