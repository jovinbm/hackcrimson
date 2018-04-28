const gql = require('graphql-tag')
const {getEntityIds, getEntities} = require('../entities/getEntities')

const types = gql`
  type Poll {
    id: MongooseObjectId
    name: String
    description: String
    entities: EntityResults
    createdDate: Date
    updatedDate: Date
  }
`

const resolver = {
  Poll: {
    entities: async function(poll, args) {
      const pollId = poll.id
      const {
        ids,
        page,
        quantity,
        totalPages,
        totalResults,
      } = await getEntityIds({
        ...args.body,
        pollIds: [pollId],
      })
      
      const {entities} = await getEntities(ids)
      
      return {
        page,
        quantity,
        totalPages,
        totalResults,
        items: Object.keys(entities).map(i => entities[i]).sort((a, b) => ids.indexOf(a.id) > ids.indexOf(b.id) ? 1 : -1),
      }
    },
  },
}

exports.types = [types]
exports.resolvers = [resolver]