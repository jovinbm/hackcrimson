const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const {getVoteIds, getVotes} = require('./index')
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const types = gql`
  enum VoteFindParamsSort {
    createdDateASC
    createdDateDESC
  }
  input VoteFindParams {
    page: Int = 1,
    quantity: Int = 100,
    ids: [MongooseObjectId!],
    pollIds: [MongooseObjectId!],
    entityIds: [MongooseObjectId!],
    minCreatedDate: Date,
    maxCreatedDate: Date,
    minUpdatedDate: Date,
    maxUpdatedDate: Date,
    sort: [VoteFindParamsSort!]
  }
  type VoteResults {
    page: Int!
    quantity: Int!
    totalPages: Int!
    totalResults: Int!
    items: [Vote!]!
  }
  extend type Query {
    votes(token: String!, body: VoteFindParams!): VoteResults
  }
  extend type Query {
    vote(token: String!, id: MongooseObjectId!): Vote
  }
`

const resolver = {
  Query: {
    vote: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      async function(_, args, context) {
        const {votes} = await getVotes([args.id])
        const voteIds = Object.keys(votes)
        if (voteIds.length > 0) {
          return votes[voteIds[0]]
        } else {
          return null
        }
      },
    ]),
    votes: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      async function(_, args, context) {
        const {
          ids,
          page,
          quantity,
          totalPages,
          totalResults,
        } = await getVoteIds({...args.body})
        
        const {votes} = await getVotes(ids)
        
        return {
          page,
          quantity,
          totalPages,
          totalResults,
          items: Object.keys(votes).map(i => votes[i]).sort((a, b) => ids.indexOf(a.id) > ids.indexOf(b.id) ? 1 : -1),
        }
      },
    ]),
  },
}

exports.types = [types]
exports.resolvers = [resolver]
