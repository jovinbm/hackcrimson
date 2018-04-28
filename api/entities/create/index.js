const Poll = require('../../../models/Poll/index')
const Entity = require('../../../models/Entity/index')
const errors = require('../../../errors.js')

exports.entityCreate = async function(data) {
  const entityData = {
    name: data.name,
    description: data.description,
  }
  
  // poll must exist
  const poll = await Poll.findById(data.pollId).exec()
  if (!poll) {
    throw errors.makeErrorInstance(errors.err.OBJECT_NOT_FOUND, {name: 'poll'})
  }
  entityData.pollId = data.pollId
  
  const newEntity = new Entity(entityData)
  await newEntity.save()
  
  return {
    entities: {
      [newEntity._id]: newEntity.toJSON(),
    },
  }
}
