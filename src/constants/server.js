const os = require('os')

/**
 * Various server configuration options
 *
 * MAILSERVER_HOSTNAME
 * MAILSERVER_PORT
 */

const SERVER = {
  HOSTNAME: process.env.MAILSERVER_HOSTNAME || os.hostname(),
  PORTS: {
    NORM: 25,
    SSL: 465
  },
  REDACT: {
    SCOPE: {
      SUBJECT: 'subject',
      CONTENT: 'content'
    }
  }
}

module.exports = SERVER
