const errors = require('../../errors.js')
const config = require('../../config')

module.exports = async function(_, args, context) {
  const {token} = args
  if (!token) {
    throw errors.makeErrorInstance(errors.err.NOT_AUTHENTICATED)
  }
  if (token !== config.sampleToken) {
    throw errors.makeErrorInstance(errors.err.INVALID_TOKEN)
  }
  return true
}