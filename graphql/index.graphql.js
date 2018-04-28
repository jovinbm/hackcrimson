const gql = require('graphql-tag')
const {GraphQLScalarType} = require('graphql')
const {Kind} = require('graphql/language')
const moment = require('moment')
const mongoose = require('mongoose')

function validateDate(value) {
  if (!moment(value, moment.ISO_8601).isValid()) {
    throw new Error('must be a date string in iso format')
  }
  if (moment(value).parseZone().utcOffset() !== 0) {
    throw new Error('must be on UTC timezone')
  }
}

const types = gql`
  scalar Date
  scalar MongooseObjectId
`

const resolver = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type (must be in ISO format and UTC timezone)',
    serialize(value) {
      // value sent to the client
      return moment(value).toISOString()
    },
    parseValue(value) {
      // value from the client
      validateDate(value)
      return moment(value).toISOString()
    },
    parseLiteral(ast) {
      // ast value is always in string format
      if (ast.kind === Kind.STRING) {
        validateDate(ast.value)
        return moment(ast.value).toISOString()
      }
      return null
    },
  }),
  MongooseObjectId: new GraphQLScalarType({
    name: 'MongooseObjectId',
    description: 'mongoose objectId',
    serialize(value) {
      // value sent to the client
      return String(value)
    },
    parseValue(value) {
      // value from the client
      if (mongoose.Types.ObjectId.isValid(value)) {
        return value
      } else {
        throw new Error('not mongoose object id')
      }
    },
    parseLiteral(ast) {
      // ast value is always in string format
      if (ast.kind === Kind.STRING) {
        if (mongoose.Types.ObjectId.isValid(ast.value)) {
          return ast.value
        } else {
          throw new Error('not mongoose object id')
        }
      }
      return null
    },
  }),
}

exports.types = [types]
exports.resolvers = [resolver]