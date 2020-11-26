const parser = require('mailparser').simpleParser

const constants = require('../constants')
const env = require('../utilities/env')
const file = require('../utilities/file')
const mail = require('../utilities/mail')
const log = require('../utilities/log')

const handler = (stream, { user }, callback) => {
  const chunks = []

  log.verbose(`Email received from ${user}.`)

  stream.on('data', chunk => chunks.push(chunk))

  stream.on('end', async () => {
    const rulesPath = 'MAILSERVER_REDACT_RULES_PATH'
    const filtersPath = 'MAILSERVER_REDACT_FILTERS_PATH'
    const now = `${+new Date()}`

    // Convert raw email into an object
    const data = Buffer.concat(chunks).toString('utf8')
    const parsed = await parser(data)

    // Check that the rules file exists
    if (env.isset(rulesPath)) {
      const obj = await file.json(env.get(rulesPath))

      if (obj && typeof obj === 'object') {
        const rules = Object.entries(obj)

        log.info(`${rules.length} rule(s) found.`)

        // Loop through each available rule
        for (let i = 0; i < rules.length; i++) {
          const [rule, { scope }] = rules[i]
          const regexp = new RegExp(rule)
          let skip = false

          // Check that scopes are valid then test
          switch (scope) {
            case constants.SERVER.REDACT.SCOPE.SUBJECT:
              if (parsed.subject) {
                if (regexp.test(parsed.subject)) {
                  skip = true
                }
              }

              break
            case constants.SERVER.REDACT.SCOPE.CONTENT:
              if (parsed.text) {
                skip = regexp.test(parsed.text, 'm')
              } else if (parsed.textAsHtml) {
                skip = regexp.test(parsed.textAsHtml, 'm')
              }
          }

          // Skipped then exit out early
          if (skip === true) {
            log.verbose(`Rule #${i + 1} matched. Skipping email.`)

            return callback()
          }
        }
      } else {
        log.error(`Invalid ${rulesPath} JSON provided.`)
      }
    } else {
      log.warn(`'${rulesPath}' is not set.`)
    }

    // Check that the filters file exists
    if (env.isset(filtersPath)) {
      const obj = await file.json(env.get(filtersPath))

      if (obj && typeof obj === 'object') {
        const filters = Object.entries(obj)

        log.info(`${filters.length} filter(s) found.`)

        // Loop through each available filter
        for (let i = 0; i < filters.length; i++) {
          const [filter, { scope, replacement }] = filters[i]
          const regexp = new RegExp(filter)

          // Check that scopes are valid then test
          switch (scope) {
            case constants.SERVER.REDACT.SCOPE.SUBJECT:
              if (parsed.subject) {
                parsed.subject = parsed.subject.replace(regexp, replacement)
              }

              break
            case constants.SERVER.REDACT.SCOPE.CONTENT:
              if (parsed.text) {
                parsed.text = parsed.text.replace(regexp, replacement)
              }

              if (parsed.textAsHtml) {
                parsed.textAsHtml = parsed.textAsHtml.replace(regexp, replacement)
              }
          }
        }
      } else {
        log.error(`Invalid ${filtersPath} JSON provided.`)
      }
    } else {
      log.warn(`'${filtersPath}' is not set.`)
    }

    // Write JSON to file
    await file.write(
      constants.PATH.STORAGE.MAIL(user, now, 'json'),
      await mail.toJson(parsed)
    )

    // Write raw to file
    await file.write(
      constants.PATH.STORAGE.MAIL(user, now, 'raw'),
      await mail.fromJson(parsed)
    )

    log.verbose(`Email written to disk at ${constants.PATH.STORAGE.MAIL(user, now)}`)

    callback()
  })
}

module.exports = handler
