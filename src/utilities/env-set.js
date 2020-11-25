const handler = key => {
  if (typeof key === 'string') {
    const val = process.env[key]

    return val !== undefined && val !== null && val.length > 0
  }

  return false
}

module.exports = handler
