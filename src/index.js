const fs = require('fs')
const SMTP = require('smtp-server').SMTPServer
const { constants: tls } = require('crypto')

const constants = require('./constants')
const hooks = require('./hooks')
const log = require('./utilities/log')
const file = require('./utilities/file')

async function main () {
  const opts = hooks

  opts.hostname = constants.SERVER.HOSTNAME
  opts.logger = true

  log.verbose('Starting SMTP server.')
  log.info('Checking for SSL configuration.')

  const keyPath = constants.PATH.SSL.KEY_PATH
  const certPath = constants.PATH.SSL.CERT_PATH

  // Check that SSL paths are set
  if (keyPath && certPath) {
    const keyExists = await file.exists(keyPath)
    const certExists = await file.exists(certPath)

    // Check that SSL paths exist
    if (keyExists && certExists) {
      opts.secure = true
      opts.key = fs.readFileSync(keyPath)
      opts.cert = fs.readFileSync(certPath)
      opts.secureOpts = tls.SSL_OP_NO_TLSv1 | tls.SSL_OP_NO_TLSv1_1 | tls.SSL_OP_NO_TLSv1_2
    } else {
      log.warn('SSL configured but invalid paths provided.')
    }
  } else {
    log.warn('SSL not configured.')
  }

  const server = new SMTP(opts)

  const port =
    opts.secure
      ? constants.SERVER.PORTS.SSL
      : constants.SERVER.PORTS.NORM

  server.listen(
    port,
    () => {
      log.info(`SMTP server running on port ${port}.`)
    }
  )
}

main()
