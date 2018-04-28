const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const pollCreate = require('./index').pollCreate
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const mutations = gql`
  input pollCreateBody {
    name: String!
    description: String!
  }
  extend type Mutation {
    pollCreate(token: String!, body: pollCreateBody!): Poll
  }
`

const resolver = {
  Mutation: {
    pollCreate: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      (_, args, context) => {
        return pollCreate({...args.body})
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