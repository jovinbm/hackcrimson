const gql = require('graphql-tag')
const {getPolls} = require('../polls/getPolls')

const types = gql`
  type Entity {
    id: MongooseObjectId
    pollId: MongooseObjectId
    poll: Poll
    name: String
    description: String
    createdDate: Date
    updatedDate: Date
  }
`

const resolver = {
  Entity: {
    poll: async function(entity) {
      const {polls} = await getPolls([entity.pollId])
      return polls[entity.pollId] || null
    },
  },
}

exports.types = [types]
exports.resolvers = [resolver]