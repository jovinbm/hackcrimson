const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const entityUpdate = require('./index').entityUpdate
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const mutations = gql`
  input entityUpdateBody {
    id: MongooseObjectId!
    pollId: MongooseObjectId
    name: String
    description: String
  }
  extend type Mutation {
    entityUpdate(token: String!, body: entityUpdateBody!): Entity
  }
`

const resolver = {
  Mutation: {
    entityUpdate: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      (_, args, context) => {
        return entityUpdate({...args.body})
          .then(({entities}) => {
            const data = entities[Object.keys(entities)[0]]
            
            return data || null
          })
      },
    ]),
  },
}

exports.mutations = [mutations]
exports.resolvers = [resolver]