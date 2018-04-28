const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const entityDelete = require('./index').entityDelete
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const mutations = gql`
  input entityDeleteBody {
    id: MongooseObjectId!
  }
  extend type Mutation {
    entityDelete(token: String!, body: entityDeleteBody!): Entity
  }
`

const resolver = {
  Mutation: {
    entityDelete: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      (_, args, context) => {
        return entityDelete({...args.body})
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