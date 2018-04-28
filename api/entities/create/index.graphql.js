const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const entityCreate = require('./index').entityCreate
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const mutations = gql`
  input entityCreateBody {
    pollId: MongooseObjectId!
    name: String!
    description: String!
  }
  extend type Mutation {
    entityCreate(token: String!, body: entityCreateBody!): Entity
  }
`

const resolver = {
  Mutation: {
    entityCreate: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      (_, args, context) => {
        return entityCreate({...args.body})
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