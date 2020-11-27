const os = require('os')
const tls = require('tls')

/**
 * Various server configuration options
 *
 * MAILSERVER_HOSTNAME
 * MAILSERVER_SSL_MIN_VERSION
 */

const SERVER = {
  HOSTNAME: process.env.MAILSERVER_HOSTNAME || os.hostname(),
  SSL: {
    MIN_VERSION: process.env.MAILSERVER_SSL_MIN_VERSION || tls.DEFAULT_MIN_VERSION
  },
  PORTS: {
    NORM: 25,
    SSL: 465 // or 587
  },
  REDACT: {
    SCOPE: {
      SUBJECT: 'subject',
      CONTENT: 'content'
    }
  }
}

module.exports = SERVER
