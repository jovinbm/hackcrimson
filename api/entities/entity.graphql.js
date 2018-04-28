const gql = require('graphql-tag')
const {getPolls} = require('../polls/getPolls')
const {getVoteIds, getVotes} = require('../votes/getVotes')

const types = gql`
  type Entity {
    id: MongooseObjectId
    pollId: MongooseObjectId
    poll: Poll
    votes(body: VoteFindParams): VoteResults
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
    votes: async function(entity, args) {
      const entityId = entity.id
      const {
        ids,
        page,
        quantity,
        totalPages,
        totalResults,
      } = await getVoteIds({
        ...args.body,
        entityIds: [entityId],
      })
      
      const {votes} = await getVotes(ids)
      
      return {
        page,
        quantity,
        totalPages,
        totalResults,
        items: Object.keys(votes).map(i => votes[i]).sort((a, b) => ids.indexOf(a.id) > ids.indexOf(b.id) ? 1 : -1),
      }
    },
  },
}

exports.types = [types]
exports.resolvers = [resolver]