const env = require('../utilities/env')
const file = require('../utilities/file')
const log = require('../utilities/log')

const handler = async ({ remoteAddress }, callback) => {
  const pathKey = 'MAILSERVER_AUTH_VALID_IPS_PATH'

  // Check that path key is set
  if (env.isset(pathKey)) {
    const ips = await file.json(env.get(pathKey))

    // Check that valid JSON file exists
    if (ips && Array.isArray(ips)) {
      // Attempt to find a 1:1 ip address
      if (ips.indexOf(remoteAddress) === -1) {
        const wildcards = ips.filter(ip => ip.includes('*'))

        if (wildcards.length === 0) {
          log.verbose(`${remoteAddress} blocked.`)
          callback(new Error(`Connections from ${remoteAddress} is not allowed.`))

          return
        }

        const rbits = remoteAddress.split('.')
        let valid = false

        // Compare IP bits to allow for wildcards
        for (let i = 0; i < wildcards.length; i++) {
          const wbits = wildcards[i].split('.')
          const tests = []

          if (rbits.length !== wbits.length) {
            continue
          }

          for (let j = 0; j < wbits.length; j++) {
            // If wildcard bit then assume true
            if (wbits[j] === '*') {
              tests.push(true)

              continue
            }

            tests.push(wbits[j] === rbits[j])
          }

          // Check that all bits passed
          if (tests.filter(t => !t).length === 0) {
            i = -1
            valid = true
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
    log.warn(`'${pathKey}' is not set.`)
  }

  log.verbose(`${remoteAddress} successfully accepted.`)

  callback()
}

module.exports = handler
