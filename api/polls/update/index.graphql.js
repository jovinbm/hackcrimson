const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const pollUpdate = require('./index').pollUpdate
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const mutations = gql`
  input pollUpdateBody {
    id: MongooseObjectId!
    name: String
    description: String
  }
  extend type Mutation {
    pollUpdate(token: String!, body: pollUpdateBody!): Poll
  }
`

const resolver = {
  Mutation: {
    pollUpdate: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      (_, args, context) => {
        return pollUpdate({...args.body})
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