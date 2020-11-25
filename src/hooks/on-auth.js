const env = require('../utilities/env')
const log = require('../utilities/log')

const handler = async (auth, session, callback) => {
  const pathKey = 'MAILSERVER_AUTH_VALID_USERS_PATH'

  // Check that path key is set
  if (env.isset(pathKey)) {
    const users = await env.open(pathKey)

    // Check that valid JSON file exists
    if (users !== false) {
      // Attempt to find username in supplied valid users and compare passwords
      if (!users[auth.username] || users[auth.username] !== auth.password) {
        log.warn(`${auth.username} unsuccessfully authenticated.`)
        callback(new Error('Invalid username or password.'))

        return
      }
    } else {
      log.error('Invalid JSON valid users file.')
      callback(new Error('Invalid username or password.'))

      return
    }
  } else {
    log.warn(`'${pathKey}' is not set.`)
  }

  log.info(`${auth.username} successfully authenticated.`)

  callback(null, { user: auth.username })
}

module.exports = handler
