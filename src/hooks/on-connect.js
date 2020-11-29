const env = require('../utilities/env')
const file = require('../utilities/file')
const log = require('../utilities/log')

const handler = async ({ remoteAddress }, callback) => {
  const pathKey = 'MAILSERVER_AUTH_VALID_IPS_PATH'

  // Check that path key is set
  if (env.isset(pathKey)) {
    const ips = await file.json(env.get(pathKey))

    log.info(`${remoteAddress} is attempting to connect.`)

    // Check that valid JSON file exists
    if (ips && Array.isArray(ips)) {
      // Attempt to find a 1:1 ip address
      if (ips.indexOf(remoteAddress) === -1) {
        const wildcards = ips.filter(ip => ip.includes('*'))

        log.debug('Direct IP match not found.')

        if (wildcards.length === 0) {
          log.verbose(`${remoteAddress} blocked.`)
          callback(new Error(`Connections from ${remoteAddress} is not allowed.`))

          return
        }

        const rbits = remoteAddress.split('.')
        let valid = false

        log.debug(`${wildcards.length} potential matching wildcard(s).`)

        for (let i = 0; i < wildcards.length; i++) {
          const curr = wildcards[i]
          const cbits = curr.split('.')

          if (rbits.length !== cbits.length) {
            log.debug(`Skipping ${curr} check: Different length.`)

            continue
          }

          const mapped = rbits.map((r, j) => cbits[j] === '*' ? '*' : r).join('.')

          if (mapped === curr) {
            valid = true

            break
          }
        }

        if (valid === false) {
          log.verbose(`${remoteAddress} blocked.`)
          callback(new Error(`Connections from ${remoteAddress} is not allowed.`))

          return
        }
      }
    } else {
      log.error(`Invalid ${pathKey} JSON provided.`)
    }
  } else {
    log.debug(`'${pathKey}' is not set.`)
  }

  log.verbose(`${remoteAddress} successfully accepted.`)

  callback()
}

module.exports = handler
