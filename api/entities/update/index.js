const Entity = require('../../../models/Entity/index')
const Poll = require('../../../models/Poll/index')
const errors = require('../../../errors.js')

exports.entityUpdate = async function(data) {
  const entity = await Entity.findById(data.id).exec()
  if (!entity) {
    throw errors.makeErrorInstance(errors.err.OBJECT_NOT_FOUND, {name: 'entity'})
  }
  
  if ('name' in data) {
    entity.name = data.name
  }
  if ('description' in data) {
    entity.description = data.description
  }
  
  if ('pollId' in data) {
    // poll must exist
    const poll = await Poll.findById(data.pollId).exec()
    if (!poll) {
      throw errors.makeErrorInstance(errors.err.OBJECT_NOT_FOUND, {name: 'poll'})
    }
    entity.pollId = data.pollId
  }
  
  await entity.save()
  
  return {
    entities: {
      [entity._id]: entity.toJSON(),
    },
  }
}
