const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const {getPollIds, getPolls} = require('./index')
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const types = gql`
  enum PollFindParamsSort {
    nameASC
    nameDESC
    createdDateASC
    createdDateDESC
  }
  input PollFindParams {
    page: Int = 1,
    quantity: Int = 100,
    ids: [MongooseObjectId!],
    names: [String!],
    searchText: String,
    minCreatedDate: Date,
    maxCreatedDate: Date,
    minUpdatedDate: Date,
    maxUpdatedDate: Date,
    sort: [PollFindParamsSort!]
  }
  type PollResults {
    page: Int!
    quantity: Int!
    totalPages: Int!
    totalResults: Int!
    items: [Poll!]!
  }
  extend type Query {
    polls(token: String!, body: PollFindParams!): PollResults
  }
  extend type Query {
    poll(token: String!, id: MongooseObjectId!): Poll
  }
`

const resolver = {
  Query: {
    poll: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      async function(_, args, context) {
        const {polls} = await getPolls([args.id])
        const pollIds = Object.keys(polls)
        if (pollIds.length > 0) {
          return polls[pollIds[0]]
        } else {
          return null
        }
      },
    ]),
    polls: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      async function(_, args, context) {
        const {
          ids,
          page,
          quantity,
          totalPages,
          totalResults,
        } = await getPollIds({...args.body})
        
        const {polls} = await getPolls(ids)
        
        return {
          page,
          quantity,
          totalPages,
          totalResults,
          items: Object.keys(polls).map(i => polls[i]).sort((a, b) => ids.indexOf(a.id) > ids.indexOf(b.id) ? 1 : -1),
        }
      },
    ]),
  },
}

exports.types = [types]
exports.resolvers = [resolver]
