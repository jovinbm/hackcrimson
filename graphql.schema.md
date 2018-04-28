
# GraphQL Spec

```

input entityCreateBody {
  pollId: MongooseObjectId!
  name: String!
  description: String!
}

extend type Mutation {
  entityCreate(token: String!, body: entityCreateBody!): Entity
}

input entityDeleteBody {
  id: MongooseObjectId!
}

extend type Mutation {
  entityDelete(token: String!, body: entityDeleteBody!): Entity
}

type Entity {
  id: MongooseObjectId
  pollId: MongooseObjectId
  poll: Poll
  name: String
  description: String
  createdDate: Date
  updatedDate: Date
}

enum EntityFindParamsSort {
  nameASC
  nameDESC
  createdDateASC
  createdDateDESC
}

input EntityFindParams {
  page: Int = 1
  quantity: Int = 100
  ids: [MongooseObjectId!]
  pollIds: [MongooseObjectId!]
  names: [String!]
  searchText: String
  minCreatedDate: Date
  maxCreatedDate: Date
  minUpdatedDate: Date
  maxUpdatedDate: Date
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

input entityUpdateBody {
  id: MongooseObjectId!
  pollId: MongooseObjectId
  name: String
  description: String
}

extend type Mutation {
  entityUpdate(token: String!, body: entityUpdateBody!): Entity
}

input pollCreateBody {
  name: String!
  description: String!
}

extend type Mutation {
  pollCreate(token: String!, body: pollCreateBody!): Poll
}

input pollDeleteBody {
  id: MongooseObjectId!
}

extend type Mutation {
  pollDelete(token: String!, body: pollDeleteBody!): Poll
}

enum PollFindParamsSort {
  nameASC
  nameDESC
  createdDateASC
  createdDateDESC
}

input PollFindParams {
  page: Int = 1
  quantity: Int = 100
  ids: [MongooseObjectId!]
  names: [String!]
  searchText: String
  minCreatedDate: Date
  maxCreatedDate: Date
  minUpdatedDate: Date
  maxUpdatedDate: Date
  sort: [PollFindParamsSort!]
}

type PollResults {
  page: Int!
  quantity: Int!
  totalPages: Int!
  totalResults: Int!
  items: [Poll!]!
}

extend type Query {
  polls(token: String!, body: PollFindParams!): PollResults
}

extend type Query {
  poll(token: String!, id: MongooseObjectId!): Poll
}

type Poll {
  id: MongooseObjectId
  name: String
  description: String
  entities: EntityResults
  createdDate: Date
  updatedDate: Date
}

input pollUpdateBody {
  id: MongooseObjectId!
  name: String
  description: String
}

extend type Mutation {
  pollUpdate(token: String!, body: pollUpdateBody!): Poll
}

scalar Date

scalar MongooseObjectId

```