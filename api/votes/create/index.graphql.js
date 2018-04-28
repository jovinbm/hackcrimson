const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const voteCreate = require('./index').voteCreate
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const mutations = gql`
  input voteCreateBody {
    userId: String!
    pollId: MongooseObjectId!
    entityId: MongooseObjectId!
  }
  extend type Mutation {
    voteCreate(token: String!, body: voteCreateBody!): Vote
  }
`

const resolver = {
  Mutation: {
    voteCreate: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      (_, args, context) => {
        return voteCreate({...args.body})
          .then(({votes}) => {
            const data = votes[Object.keys(votes)[0]]
            
            return data || null
          })
      },
    ]),
  },
}

exports.mutations = [mutations]
exports.resolvers = [resolver]