const path = require('path')
const env = process.env

/**
 * Various path configuration options
 *
 * MAILSERVER_SSL_KEY_PATH
 * MAILSERVER_SSL_CERT_PATH
 * MAILSERVER_SSL_CA_PATH
 * MAILSERVER_AUTH_VALID_USERS_PATH
 * MAILSERVER_AUTH_VALID_IPS_PATH
 * MAILSERVER_VALID_SENDER_EMAILS_PATH
 * MAILSERVER_VALID_RECEIVER_EMAILS_PATH
 * MAILSERVER_REDACT_FILTERS_PATH
 * MAILSERVER_REDACT_RULES_PATH
 */

const PATH = {
  SSL: {
    KEY_PATH: env.MAILSERVER_SSL_KEY_PATH,
    CERT_PATH: env.MAILSERVER_SSL_CERT_PATH,
    CA_PATH: env.MAILSERVER_SSL_CA_PATH
  },
  AUTH: {
    VALID_USERS_PATH: env.MAILSERVER_AUTH_VALID_USERS_PATH,
    VALID_IPS_PATH: env.MAILSERVER_AUTH_VALID_IPS_PATH,
    VALID_SENDER_EMAILS_PATH: env.MAILSERVER_AUTH_VALID_EMAILS_PATH,
    VALID_RECEIVER_EMAILS_PATH: env.MAILSERVER_AUTH_VALID_RECEIVER_EMAILS_PATH
  },
  REDACT: {
    FILTERS_PATH: env.MAILSERVER_REDACT_FILTERS_PATH,
    RULES_PATH: env.MAILSERVER_REDACT_RULES_PATH
  },
  STORAGE: {
    LOGS: '/var/smtp-logger/logs/events.log',
    MAIL: (...args) => path.join('/var/smtp-logger/storage/mail', ...args)
  }
}

module.exports = PATH
