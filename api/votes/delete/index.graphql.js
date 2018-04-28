const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const voteDelete = require('./index').voteDelete
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const mutations = gql`
  input voteDeleteBody {
    id: MongooseObjectId!
  }
  extend type Mutation {
    voteDelete(token: String!, body: voteDeleteBody!): Vote
  }
`

const resolver = {
  Mutation: {
    voteDelete: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      (_, args, context) => {
        return voteDelete({...args.body})
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