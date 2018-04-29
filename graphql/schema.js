const glob = require('glob')
const gql = require('graphql-tag')
const {makeExecutableSchema} = require('graphql-tools')
const merge = require('lodash.merge')
const path = require('path')

const graphqlSchemas = glob.sync(path.join(__dirname, '../**/*.graphql.js'))
const schemas = graphqlSchemas.map(filePath => require(filePath))
const SchemaDefinition = gql`
  type Query {
    welcomeQuery: Int
  }
  type Mutation {
    welcomeMutation: Int
  }
  type Subscription {
    welcomeSubscription: Int
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`
let typeDefs = [SchemaDefinition]
let resolvers = []

schemas.map(sc => {
  
  const {
    types = [],
    queries = [],
    mutations = [],
    subscriptions = [],
    resolvers: rsvs = [],
  } = sc
  
  typeDefs = typeDefs.concat(types)
  typeDefs = typeDefs.concat(queries)
  typeDefs = typeDefs.concat(mutations)
  typeDefs = typeDefs.concat(subscriptions)
  resolvers = resolvers.concat(rsvs)
  
  return true
  
})

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers: merge(...resolvers),
  allowUndefinedInResolve: true,
})