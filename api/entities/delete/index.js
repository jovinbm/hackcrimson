const Entity = require('../../../models/Entity/index')

exports.entityDelete = async function(data) {
  await Entity.remove({_id: data.id}).exec()
  
  return {
    entities: {
      [data.id]: null,
    },
  }
}
