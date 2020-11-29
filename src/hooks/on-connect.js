const constants = require('../constants')
const integrations = require('../integrations')
const file = require('../utilities/file')
const log = require('../utilities/log')

const handler = async ({ remoteAddress }, callback) => {
  const pathKey = constants.PATH.AUTH.VALID_IPS_PATH

  // Check that path key is set
  if (pathKey) {
    const ips = await file.json(pathKey)

    log.info(`${remoteAddress} is attempting to connect.`)

    await integrations.slack.checkAndNotify(
      'connect', `${remoteAddress} is attempting to connect.`
    )

    // Check that valid JSON file exists
    if (ips && Array.isArray(ips)) {
      // Attempt to find a 1:1 ip address
      if (ips.indexOf(remoteAddress) === -1) {
        const wildcards = ips.filter(ip => ip.includes('*'))

        log.debug('Direct IP match not found.')

        if (wildcards.length === 0) {
          log.verbose(`${remoteAddress} blocked.`)

          await integrations.slack.checkAndNotify(
            'connect', `${remoteAddress} blocked.`
          )

          callback(new Error(`Connections from ${remoteAddress} is not allowed.`))

          return
        }

        const rbits = remoteAddress.split('.')
        let valid = false

        log.debug(`${wildcards.length} potential matching wildcard(s).`)

        // Start checking for wildcard matches
        for (let i = 0; i < wildcards.length; i++) {
          const curr = wildcards[i]
          const cbits = curr.split('.')

          // Make sure wildcard has same segments as remote address
          if (rbits.length !== cbits.length) {
            log.debug(`Skipping ${curr} check: Different length.`)

            continue
          }

          // Map remote address to include wildcard flags
          const mapped = rbits.map((r, j) => cbits[j] === '*' ? '*' : r).join('.')

          // Directly compare wildcard and mapped remote address
          if (mapped === curr) {
            valid = true

            break
          }
        }

        if (valid === false) {
          log.verbose(`${remoteAddress} blocked.`)

          await integrations.slack.checkAndNotify(
            'connect', `${remoteAddress} blocked.`
          )

          callback(new Error(`Connections from ${remoteAddress} is not allowed.`))

          return
        }
      }
    } else {
      log.error(`Invalid ${pathKey} JSON provided.`)
      callback(new Error(`Connections from ${remoteAddress} is not allowed.`))

      return
    }
  } else {
    log.debug('MAILSERVER_AUTH_VALID_IPS_PATH is not set.')
  }

  log.verbose(`${remoteAddress} successfully accepted.`)

  await integrations.slack.checkAndNotify(
    'connect', `${remoteAddress} successfully accepted.`
  )

  callback()
}

module.exports = handler
