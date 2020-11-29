const axios = require('axios')

const constants = require('../constants')
const log = require('../utilities/log')

exports.shouldNotify = hook => {
  return constants.INTEGRATION.SLACK.NOTIFY_ON.includes(hook)
}

exports.notify = async message => {
  const webhook = constants.INTEGRATION.SLACK.WEBHOOK_URL

  if (webhook) {
    try {
      await axios.request({
        url: webhook,
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          text: message
        }
      })

      log.debug('Slack has been notified.')
    } catch (e) {
      log.error('Unable to notify Slack.')
    }
  }
}

exports.checkAndNotify = async (hook, message) => {
  if (this.shouldNotify(hook)) {
    await this.notify(message)
  }
}
