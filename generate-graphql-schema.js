const generateJSON = require('generate-graphql').generateJSON
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const graphqlSchemas = glob.sync(path.join(__dirname, '/**/*.graphql.js'))
const schemas = graphqlSchemas.map(filePath => require(filePath))
const {print} = require('graphql/language/printer')

let raw_schema = `
# GraphQL Spec

\`\`\`

`

schemas.map(sc => {
  const {
    types = [],
    queries = [],
    mutations = [],
  } = sc
  
  types.map(type => {
    raw_schema += print(type)
    raw_schema += '\n'
  })
  
  queries.map(query => {
    raw_schema += print(query)
    raw_schema += '\n'
  })
  
  mutations.map(mutation => {
    raw_schema += print(mutation)
    raw_schema += '\n'
  })
  
  return true
})

raw_schema += '\`\`\`'

fs.writeFileSync(path.join(__dirname, '/graphql.schema.md'), raw_schema, 'utf8')

generateJSON(path.join(__dirname, 'graphql/schema.js'), path.join(__dirname, 'graphql.schema.json'))
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })