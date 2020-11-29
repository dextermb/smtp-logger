const os = require('os')
const tls = require('tls')
const env = process.env

/**
 * Various server configuration options
 *
 * MAILSERVER_HOSTNAME
 * MAILSERVER_DEBUG
 * MAILSERVER_SSL_MIN_VERSION
 */

const SERVER = {
  HOSTNAME: env.MAILSERVER_HOSTNAME || os.hostname(),
  DEBUG: env.MAILSERVER_DEBUG === 'true' || false,
  SSL: {
    MIN_VERSION: env.MAILSERVER_SSL_MIN_VERSION || tls.DEFAULT_MIN_VERSION
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
