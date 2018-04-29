const graphQlSchema = require('../graphql/schema')
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express')
const express = require('express')
const router = express.Router()
const compiledGraphQLSchema = require('../graphql.schema')
const errors = require('../errors')
const config = require('../config')

function formatMongooseErrors(err) {
  if (!err) {
    return err
  }
  if (err.name === 'BulkWriteError') {
    const groups = /\.\$([a-zA-Z0-9_]+?)_.*/.exec(err.message)
    if (/duplicate key error/.test(err.message) && groups[1]) {
      return errors.makeError(errors.err.DUPLICATE, {
        field: groups[1],
      })
    }
  }
  if (err.name === 'ValidationError' && err.errors) {
    const fields = {}
    Object.keys(err.errors).forEach(function(field) {
      // Getting from .properties now.
      const eObj = err.errors[field].properties
      if (/not a valid enum value/.test(eObj.message)) {
        fields[field] = 'Value not allowed'
      } else if (/is less than minimum allowed value/.test(eObj.message)) {
        fields[field] = 'Below minimum'
      } else if (/is more than maximum allowed value/.test(eObj.message)) {
        fields[field] = 'Above maximum'
      } else {
        fields[field] = eObj.message
      }
    })
    return errors.makeError(errors.err.INVALID_FIELD, {...fields})
  }
  return err
}

router.get('/graphqlSchema', (req, res, next) => {
  return res.json(compiledGraphQLSchema)
})

router.use('/graphql', (req, res, next) => {
  const GraphQLOptions = {
    schema: graphQlSchema,
    formatError: err => {
      if (err.originalError) {
        err = {
          ...err,
          ...err.originalError.toJSON ? err.originalError.toJSON() : err.originalError,
          ...formatMongooseErrors(err.originalError),
        }
      }
      // if msg in err, create the human readable error from it
      if ('msg' in err && 'context' in err) {
        err.message = `${err.msg}: ${Object.keys(err.context).map(key => `${key}->${err.context[key]}`).join(', ')}`
      }
      return err
    },
    context: {
      apollo: true,
      req,
      res,
    },
  }
  
  return graphqlExpress(GraphQLOptions)(req, res, next)
})

router.all('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${config.port}/subscriptions`,
}))

module.exports = router