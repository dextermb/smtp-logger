const hooks = {
  onAuth: require('./on-auth'),
  onClose: require('./on-close'),
  onConnect: require('./on-connect'),
  onData: require('./on-data'),
  onMailFrom: require('./on-mail-from'),
  onRcptTo: require('./on-rcpt-to')
}

module.exports = hooks
