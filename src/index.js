const fs = require('fs')
const SMTP = require('smtp-server').SMTPServer

const constants = require('./constants')
const hooks = require('./hooks')

const log = require('./utilities/log')
const exists = require('./utilities/path-exists')

async function main () {
  const opts = hooks

  log.verbose('Starting SMTP server')

  opts.hostname = constants.SERVER.HOSTNAME

  log.info('Checking for SSL configuration')

  const keyPath = constants.PATH.SSL.KEY_PATH
  const certPath = constants.PATH.SSL.CERT_PATH

  // Check that SSL paths are set
  if (keyPath && certPath) {
    const keyExists = await exists(keyPath)
    const certExists = await exists(certPath)

    // Check that SSL paths exist
    if (keyExists && certExists) {
      opts.secure = true
      opts.key = fs.readFileSync(keyPath)
      opts.cert = fs.readFileSync(certPath)
    } else {
      log.warn('SSL configured but invalid paths provided')
    }
  } else {
    log.warn('SSL not configured')
  }

  const server = new SMTP(opts)
  const port = constants.SERVER.PORT

  server.listen(
    port,
    () => {
      log.info(`SMTP server running on port ${port}`)
    }
  )
}

main()
