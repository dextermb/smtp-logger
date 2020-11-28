const dir = require('make-dir')

const constants = require('../constants')
const env = require('../utilities/env')
const file = require('../utilities/file')
const log = require('../utilities/log')

const handler = async (auth, _, callback) => {
  const pathKey = 'MAILSERVER_AUTH_VALID_USERS_PATH'

  // Check that path key is set
  if (env.isset(pathKey)) {
    const users = await file.json(env.get(pathKey))

    log.info(`${auth.username} is attempting to authenticate.`)

    // Check that valid JSON file exists
    if (users && typeof users === 'object') {
      // Attempt to find username in supplied valid users and compare passwords
      if (!users[auth.username] || users[auth.username] !== auth.password) {
        log.verbose(`${auth.username} unsuccessfully authenticated.`)
        callback(new Error('Invalid username or password.'))

        return
      }
    } else {
      log.error(`Invalid ${pathKey} JSON provided.`)
      callback(new Error('Invalid username or password.'))

      return
    }
  } else {
    log.debug(`'${pathKey}' is not set.`)
  }

  log.verbose(`${auth.username} successfully authenticated.`)

  await dir(constants.PATH.STORAGE.MAIL(auth.username))

  callback(null, { user: auth.username })
}

module.exports = handler
