const Poll = require('../../../models/Poll/index')

exports.pollDelete = async function(data) {
  await Poll.remove({_id: data.id}).exec()
  
  return {
    polls: {
      [data.id]: null,
    },
  }
}
