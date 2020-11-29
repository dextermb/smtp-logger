const log = require('../utilities/log')

const handler = ({ user }) => {
  log.verbose(`${user} has disconnected.`)
}

module.exports = handler
