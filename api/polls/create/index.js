const Poll = require('../../../models/Poll/index')

exports.pollCreate = async function(data) {
  const pollData = {
    name: data.name,
    description: data.description,
  }
  
  const newPoll = new Poll(pollData)
  await newPoll.save()
  
  return {
    polls: {
      [newPoll._id]: newPoll.toJSON(),
    },
  }
}
