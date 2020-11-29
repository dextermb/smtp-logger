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
    const rulesPath = constants.PATH.REDACT.RULES_PATH
    const filtersPath = constants.PATH.REDACT.FILTERS_PATH
    const now = `${+new Date()}`

    // Convert raw email into an object
    const data = Buffer.concat(chunks).toString('utf8')
    const parsed = await parser(data)

    // Check that the rules file exists
    if (rulesPath) {
      const obj = await file.json(rulesPath)

      if (obj && typeof obj === 'object') {
        const rules = Object.entries(obj)

        log.debug(`${rules.length} rule(s) found.`)

        // Loop through each available rule
        for (let i = 0; i < rules.length; i++) {
          const [rule, { scope }] = rules[i]
          const regexp = new RegExp(rule)
          let skip = false

          // Check that scopes are valid then test
          switch (scope) {
            case constants.SERVER.REDACT.SCOPE.SUBJECT:
              // Check basic subject
              if (parsed.subject) {
                if (regexp.test(parsed.subject)) {
                  skip = true
                }
              }

              if (skip === false) {
                // Check header subject
                if (parsed.headers && parsed.headers instanceof Map) {
                  const headers = Array.from(parsed.headers.entries())
                  const header = headers.findIndex(h => h[0] === 'subject')

                  if (header !== -1 && regexp.test(headers[header][1])) {
                    skip = true
                  }
                }
              }

              if (skip === false) {
                // Check header line subject
                if (parsed.headerLines && Array.isArray(parsed.headerLines)) {
                  const headers = parsed.headerLines
                  const header = headers.indexOf(({ key }) => key === 'subject')

                  if (header !== -1 && regexp.test(headers[header].line)) {
                    skip = true
                  }
                }
              }

              break
            case constants.SERVER.REDACT.SCOPE.CONTENT:
              // Check plain text
              if (parsed.text) {
                skip = regexp.test(parsed.text, 'm')
              }

              if (skip === false) {
                // Check HTML text
                if (parsed.textAsHtml && typeof parsed.textAsHtml === 'string') {
                  skip = regexp.test(parsed.textAsHtml, 'm')
                }
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
      log.debug('MAILSERVER_REDACT_RULES_PATH is not set.')
    }

    // Check that the filters file exists
    if (filtersPath) {
      const obj = await file.json(filtersPath)

      if (obj && typeof obj === 'object') {
        const filters = Object.entries(obj)

        log.debug(`${filters.length} filter(s) found.`)

        // Loop through each available filter
        for (let i = 0; i < filters.length; i++) {
          const [filter, { scope, replacement }] = filters[i]
          const regexp = new RegExp(filter)

          // Check that scopes are valid then test
          switch (scope) {
            case constants.SERVER.REDACT.SCOPE.SUBJECT:
              // Filter basic subject
              if (parsed.subject) {
                parsed.subject = parsed.subject.replace(regexp, replacement)
              }

              // Filter header subject
              if (parsed.headers && parsed.headers instanceof Map) {
                const headers = Array.from(parsed.headers.entries())
                const header = headers.findIndex(h => h[0] === 'subject')

                if (header !== -1) {
                  headers[header][1] = headers[header][1].replace(regexp, replacement)
                  parsed.headers = new Map(headers)
                }
              }

              // Filter header line subject
              if (parsed.headerLines && Array.isArray(parsed.headerLines)) {
                const headers = parsed.headerlInes
                const header = headers.indexOf(({ key }) => key === 'subject')

                if (header !== -1) {
                  parsed.headerLines[header].line = headers[header].line.replace(regexp, replacement)
                }
              }

              break
            case constants.SERVER.REDACT.SCOPE.CONTENT:
              if (parsed.text) {
                parsed.text = parsed.text.replace(regexp, replacement)
              }

              if (parsed.textAsHtml && typeof parsed.textAsHtml === 'string') {
                parsed.textAsHtml = parsed.textAsHtml.replace(regexp, replacement)
              }
          }
        }
      } else {
        log.error(`Invalid ${filtersPath} JSON provided.`)
      }
    } else {
      log.debug('MAILSERVER_REDACT_FILTERS_PATH is not set.')
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
