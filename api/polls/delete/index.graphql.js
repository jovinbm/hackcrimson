const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const pollDelete = require('./index').pollDelete
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const mutations = gql`
  input pollDeleteBody {
    id: MongooseObjectId!
  }
  extend type Mutation {
    pollDelete(token: String!, body: pollDeleteBody!): Poll
  }
`

const resolver = {
  Mutation: {
    pollDelete: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      (_, args, context) => {
        return pollDelete({...args.body})
          .then(({polls}) => {
            const data = polls[Object.keys(polls)[0]]
            
            return data || null
          })
      },
    ]),
  },
}

exports.mutations = [mutations]
exports.resolvers = [resolver]