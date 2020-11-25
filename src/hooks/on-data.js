const handler = (stream, session, callback) => {
  stream.on('end', callback)
}

module.exports = handler
