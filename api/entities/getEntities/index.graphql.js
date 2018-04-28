const gql = require('graphql-tag')
const runWithGraphqlMiddlewares = require('../../../lib/graphqlUtils').runWithGraphqlMiddlewares
const {getEntityIds, getEntities} = require('./index')
const ensureAuthenticated = require('../../../lib/middlewares/ensureAuthenticated')

const types = gql`
  enum EntityFindParamsSort {
    nameASC
    nameDESC
    createdDateASC
    createdDateDESC
  }
  input EntityFindParams {
    page: Int = 1,
    quantity: Int = 100,
    ids: [MongooseObjectId!],
    pollIds: [MongooseObjectId!],
    names: [String!],
    searchText: String,
    minCreatedDate: Date,
    maxCreatedDate: Date,
    minUpdatedDate: Date,
    maxUpdatedDate: Date,
    sort: [EntityFindParamsSort!]
  }
  type EntityResults {
    page: Int!
    quantity: Int!
    totalPages: Int!
    totalResults: Int!
    items: [Entity!]!
  }
  extend type Query {
    entities(token: String!, body: EntityFindParams!): EntityResults
  }
  extend type Query {
    entity(token: String!, id: MongooseObjectId!): Entity
  }
`

const resolver = {
  Query: {
    entity: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      async function(_, args, context) {
        const {entities} = await getEntities([args.id])
        const entityIds = Object.keys(entities)
        if (entityIds.length > 0) {
          return entities[entityIds[0]]
        } else {
          return null
        }
      },
    ]),
    entities: runWithGraphqlMiddlewares([
      ensureAuthenticated,
      async function(_, args, context) {
        const {
          ids,
          page,
          quantity,
          totalPages,
          totalResults,
        } = await getEntityIds({...args.body})
        
        const {entities} = await getEntities(ids)
        
        return {
          page,
          quantity,
          totalPages,
          totalResults,
          items: Object.keys(entities).map(i => entities[i]).sort((a, b) => ids.indexOf(a.id) > ids.indexOf(b.id) ? 1 : -1),
        }
      },
    ]),
  },
}

exports.types = [types]
exports.resolvers = [resolver]
