const Composer = require('nodemailer/lib/mail-composer')

exports.toJson = obj => {
  if (obj && typeof obj === 'object') {
    return JSON.stringify(obj, function (key, value) {
      const obj = this[key]

      if (obj instanceof Map) {
        return {
          dataType: 'map',
          value: Array.from(obj.entries())
        }
      }

      return value
    })
  }

  return '{}'
}

exports.fromJson = data => new Promise(resolve => {
  if (typeof data === 'string') {
    data = JSON.parse(data, function (_, value) {
      if (value && typeof value === 'object') {
        if (value.dataType === 'map') {
          return new Map(value.value)
        }
      }

      return value
    })
  }

  if (typeof data !== 'object') {
    return resolve('')
  }

  const compiler = (new Composer(data)).compile()
  compiler.keepBcc = true

  const stream = compiler.createReadStream()
  const chunks = []

  stream.on('data', chunk => {
    chunks.push(chunk)
  })

  stream.on('end', () => {
    resolve(Buffer.concat(chunks).toString('utf8'))
  })
})
