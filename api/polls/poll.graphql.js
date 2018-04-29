const gql = require('graphql-tag')
const {getEntityIds, getEntities} = require('../entities/getEntities')
const {getVoteIds, getVotes} = require('../votes/getVotes')
const pubSub = require('../../graphql/pubSub')

const types = gql`
  type Poll {
    id: MongooseObjectId
    name: String
    description: String
    entities(body: EntityFindParams): EntityResults
    votes(body: VoteFindParams): VoteResults
    createdDate: Date
    updatedDate: Date
  }
`

const subscriptions = gql`
  type PV {
    status: Int
  }
  extend type Subscription {
    pollVote: PV
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
    votes: async function(poll, args) {
      const pollId = poll.id
      const {
        ids,
        page,
        quantity,
        totalPages,
        totalResults,
      } = await getVoteIds({
        ...args.body,
        pollIds: [pollId],
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
  Subscription: {
    pollVote: {
      subscribe: () => pubSub.asyncIterator('pollVote'),
    },
  },
}

exports.types = [types]
exports.resolvers = [resolver]
exports.subscriptions = [subscriptions]