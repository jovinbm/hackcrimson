
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
  votes(body: VoteFindParams): VoteResults
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
  entities(body: EntityFindParams): EntityResults
  votes(body: VoteFindParams): VoteResults
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

input voteCreateBody {
  userId: String!
  pollId: MongooseObjectId!
  entityId: MongooseObjectId!
}

extend type Mutation {
  voteCreate(token: String!, body: voteCreateBody!): Vote
}

input voteDeleteBody {
  id: MongooseObjectId!
}

extend type Mutation {
  voteDelete(token: String!, body: voteDeleteBody!): Vote
}

enum VoteFindParamsSort {
  createdDateASC
  createdDateDESC
}

input VoteFindParams {
  page: Int = 1
  quantity: Int = 100
  ids: [MongooseObjectId!]
  pollIds: [MongooseObjectId!]
  entityIds: [MongooseObjectId!]
  minCreatedDate: Date
  maxCreatedDate: Date
  minUpdatedDate: Date
  maxUpdatedDate: Date
  sort: [VoteFindParamsSort!]
}

type VoteResults {
  page: Int!
  quantity: Int!
  totalPages: Int!
  totalResults: Int!
  items: [Vote!]!
}

extend type Query {
  votes(token: String!, body: VoteFindParams!): VoteResults
}

extend type Query {
  vote(token: String!, id: MongooseObjectId!): Vote
}

type Vote {
  id: MongooseObjectId
  userId: String
  pollId: MongooseObjectId
  poll: Poll
  entityId: MongooseObjectId
  entity: Entity
  createdDate: Date
  updatedDate: Date
}

scalar Date

scalar MongooseObjectId

```