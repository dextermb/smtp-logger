const log = require('../utilities/log')

const handler = session => {
  log.info('onClose')
}

module.exports = handler
