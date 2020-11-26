const handler = (stream, session, callback) => {
  const chunks = []

  stream.on('data', chunk => chunks.push(chunk))

  stream.on('end', () => {
    console.log(Buffer.concat(chunks).toString('utf8'))
    callback()
  })
}

module.exports = handler
