const Vote = require('../../../models/Vote/index')

exports.voteDelete = async function(data) {
  await Vote.remove({_id: data.id}).exec()
  
  return {
    votes: {
      [data.id]: null,
    },
  }
}
