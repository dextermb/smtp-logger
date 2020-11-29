const integrations = require('../integrations')
const log = require('../utilities/log')

const handler = async ({ user }) => {
  log.verbose(`${user} has disconnected.`)

  await integrations.slack.checkAndNotify(
    'close', `${user} has disconnected.`
  )
}

module.exports = handler
