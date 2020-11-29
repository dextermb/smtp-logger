const env = process.env

/**
 * Various integration configuration options
 *
 * MAILSERVER_INTEGRATION_SLACK_WEBOOK_URL
 * MAILSERVER_INTEGRATION_SLACK_NOTIFY_ON
 */

const INTEGRATION = {
  SLACK: {
    WEBHOOK_URL: env.MAILSERVER_INTEGRATION_SLACK_WEBOOK_URL,
    NOTIFY_ON: env.MAILSERVER_INTEGRATION_SLACK_NOTIFY_ON || 'auth,close,connect,data'
  }
}

module.exports = INTEGRATION
