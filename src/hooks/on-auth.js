const constants = require('../constants')
const set = require('../utilities/env-set')
const exists = require('../utilities/path-exists')
const read = require('../utilities/read-file')
const log = require('../utilities/log')

const handler = async (auth, session, callback) => {
  // Check that users path is set
  if (set('MAILSERVER_AUTH_VALID_USERS_PATH')) {
    const path = constants.PATH.AUTH.VALID_USERS_PATH

    // Check that file exists
    if (await exists(path)) {
      const data = await read(path)
      const obj = JSON.parse(data)

      // Attempt to find username in supplied valid users and compare passwords
      if (!obj[auth.username] || obj[auth.username] !== auth.password) {
        log.warn(`${auth.username} unsuccessfully authenticated.`)

        return callback(new Error('Invalid username or password'))
      }
    } else {
      log.warn(`'MAILSERVER_AUTH_VALID_USERS_PATH' set but path did not exist (${path}).`)
    }
  } else {
    log.warn('`MAILSERVER_AUTH_VALID_USERS_PATH` is not set.')
  }

  log.info(`${auth.username} successfully authenticated.`)

  callback(null, { user: auth.username })
}

module.exports = handler
