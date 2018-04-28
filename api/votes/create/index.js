const Poll = require('../../../models/Poll/index')
const Entity = require('../../../models/Entity/index')
const Vote = require('../../../models/Vote/index')
const errors = require('../../../errors.js')

exports.voteCreate = async function(data) {
  const voteData = {}
  
  // user must be provided
  if (!data.userId) {
    throw errors.makeErrorInstance(errors.err.INVALID_FIELD, {name: 'userId'})
  }
  voteData.userId = data.userId
  
  // poll must exist
  const poll = await Poll.findById(data.pollId).exec()
  if (!poll) {
    throw errors.makeErrorInstance(errors.err.OBJECT_NOT_FOUND, {name: 'poll'})
  }
  voteData.pollId = data.pollId
  
  // entity must exist
  const entity = await Entity.findById(data.entityId).exec()
  if (!entity) {
    throw errors.makeErrorInstance(errors.err.OBJECT_NOT_FOUND, {name: 'entity'})
  }
  voteData.entityId = data.entityId
  
  // user can only vote once
  const existingVote = await Vote.findOne({
    userId: voteData.userId,
    entityId: voteData.entityId,
    pollId: voteData.pollId,
  })
  
  if (existingVote) {
    return {
      votes: {
        [existingVote._id]: existingVote.toJSON(),
      },
    }
  } else {
    const newVote = new Vote(voteData)
    await newVote.save()
    return {
      votes: {
        [newVote._id]: newVote.toJSON(),
      },
    }
  }
}
