const Poll = require('../../../models/Poll/index')
const errors = require('../../../errors.js')

exports.pollUpdate = async function(data) {
  const poll = await Poll.findById(data.id).exec()
  if (!poll) {
    throw errors.makeErrorInstance(errors.err.OBJECT_NOT_FOUND, {name: 'poll'})
  }
  
  if ('name' in data) {
    poll.name = data.name
  }
  if ('description' in data) {
    poll.description = data.description
  }
  
  await poll.save()
  
  return {
    polls: {
      [poll._id]: poll.toJSON(),
    },
  }
}
