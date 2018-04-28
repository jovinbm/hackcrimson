const gql = require('graphql-tag')
const {getPolls} = require('../polls/getPolls')
const {getEntities} = require('../entities/getEntities')

const types = gql`
  type Vote {
    id: MongooseObjectId
    userId: String
    pollId: MongooseObjectId
    poll: Poll
    entityId: MongooseObjectId
    entity: Entity
    createdDate: Date
    updatedDate: Date
  }
`

const resolver = {
  Vote: {
    poll: async function(vote) {
      const {polls} = await getPolls([vote.pollId])
      return polls[vote.pollId] || null
    },
    entity: async function(vote) {
      const {entities} = await getEntities([vote.entityId])
      return entities[vote.entityId] || null
    },
  },
}

exports.types = [types]
exports.resolvers = [resolver]