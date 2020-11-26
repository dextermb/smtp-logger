const os = require('os')

/**
 * Various server configuration options
 *
 * MAILSERVER_HOSTNAME
 * MAILSERVER_PORT
 */

const SERVER = {
  HOSTNAME: process.env.MAILSERVER_HOSTNAME || os.hostname(),
  PORT: process.env.MAILSERVER_PORT || 25,
  REDACT: {
    SCOPE: {
      SUBJECT: 'subject',
      CONTENT: 'content'
    }
  }
}

module.exports = SERVER
