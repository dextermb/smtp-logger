const log = require('../utilities/log')

const handler = (address, session, callback) => {
  log.info('onMailFrom')

  callback()
}

module.exports = handler
