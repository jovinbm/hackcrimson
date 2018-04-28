const Vote = require('../../../models/Vote')

/**
 * @param {object} params
 * @returns {*}
 */
const getVoteIds = async function(params) {
  const returnValue = {
    quantity: 0,
    page: 0,
    totalPages: 0,
    totalResults: 0,
    ids: [],
  }
  
  const {
    page = 1,
    quantity = 100,
    ids,
    pollIds,
    entityIds,
    minCreatedDate,
    maxCreatedDate,
    minUpdatedDate,
    maxUpdatedDate,
    sort,
  } = params
  
  let args = {}
  const options = {
    select: '_id',
    page: page,
    limit: quantity,
    lean: true,
    leanWithId: true,
  }
  
  if (ids) {
    args._id = {
      $in: ids,
    }
  }
  
  if (pollIds) {
    args.pollId = {
      $in: pollIds,
    }
  }
  
  if (entityIds) {
    args.entityId = {
      $in: entityIds,
    }
  }
  
  if (minCreatedDate) {
    args.createdDate = {
      $gte: minCreatedDate,
    }
  }
  
  if (maxCreatedDate) {
    args.createdDate = {
      $lte: maxCreatedDate,
    }
  }
  
  if (minUpdatedDate) {
    args.updatedDate = {
      $gte: minUpdatedDate,
    }
  }
  
  if (maxUpdatedDate) {
    args.updatedDate = {
      $lte: maxUpdatedDate,
    }
  }
  
  if (sort && sort.length > 0) {
    
    options.sort = {}
    sort.map(str => {
      let column,
        direction
      
      if (str.indexOf('ASC') > -1) {
        direction = 'asc'
        column = str.split('ASC')[0]
      }
      
      if (str.indexOf('DESC') > -1) {
        direction = 'desc'
        column = str.split('DESC')[0]
      }
      
      options.sort[column] = direction
      
      return true
    })
  }
  
  await Vote.paginate(args, options)
    .then(d => {
      
      const {
        docs,
        total,
        page,
        pages,
      } = d
      
      returnValue.quantity = quantity
      returnValue.page = page
      returnValue.totalPages = pages
      returnValue.totalResults = total
      returnValue.ids = docs.map(d => d.id)
      
      return true
      
    })
  
  return returnValue
}

/**
 * @param {object[]} ids
 * @returns {*}
 */
const getVotes = async function(ids) {
  const votes = await Vote.find({
    _id: {
      $in: ids,
    },
  }).exec()
  
  return {
    votes: votes.map(doc => doc.toJSON()).reduce((prev, vote) => {
      prev[vote._id] = vote
      return prev
    }, {}),
  }
}

exports.getVoteIds = getVoteIds
exports.getVotes = getVotes