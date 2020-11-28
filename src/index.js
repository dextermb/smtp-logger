const fs = require('fs')
const SMTP = require('smtp-server').SMTPServer

const constants = require('./constants')
const hooks = require('./hooks')
const log = require('./utilities/log')
const file = require('./utilities/file')

async function main () {
  const opts = hooks

  opts.hostname = constants.SERVER.HOSTNAME
  opts.logger = constants.SERVER.DEBUG

  log.verbose('Starting SMTP server.')
  log.debug('Checking for SSL configuration.')

  const keyPath = constants.PATH.SSL.KEY_PATH
  const certPath = constants.PATH.SSL.CERT_PATH
  const caPath = constants.PATH.SSL.CA_PATH

  // Check that SSL paths are set
  if (keyPath && certPath && caPath) {
    const keyExists = await file.exists(keyPath)
    const certExists = await file.exists(certPath)
    const caExists = await file.exists(caPath)

    // Check that SSL paths exist
    if (keyExists && certExists && caExists) {
      opts.secure = true
      opts.minVersion = constants.SERVER.SSL.MIN_VERSION

      opts.key = fs.readFileSync(keyPath)
      opts.cert = fs.readFileSync(certPath)
      opts.ca = fs.readFileSync(caPath)
    } else {
      log.warn('SSL configured but invalid paths provided.')
    }
  } else {
    log.debug('SSL not configured.')
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

  server.on('error', err => {
    log.verbose(err.message)
    log.error(err)
  })
}

main()
