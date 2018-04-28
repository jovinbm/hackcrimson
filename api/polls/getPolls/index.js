const Poll = require('../../../models/Poll')
const mongoose = require('mongoose')

/**
 * @param {object} params
 * @returns {*}
 */
const getPollIds = async function(params) {
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
    names,
    searchText,
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
  
  if (names) {
    args.name = {
      $in: names,
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
  
  if (searchText) {
    const searchArgs = {
      $or: [],
    }
    if (mongoose.Types.ObjectId.isValid(searchText)) {
      searchArgs.$or.push({
        _id: searchText,
      })
    }
    searchArgs.$or.push({
      name: {
        $regex: `.*${searchText}.*`,
        $options: 'i',
      },
    })
    searchArgs.$or.push({
      description: {
        $regex: `.*${searchText}.*`,
        $options: 'i',
      },
    })
    args = {
      $and: [
        args,
        searchArgs,
      ],
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
  
  await Poll.paginate(args, options)
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
const getPolls = async function(ids) {
  const polls = await Poll.find({
    _id: {
      $in: ids,
    },
  }).exec()
  
  return {
    polls: polls.map(doc => doc.toJSON()).reduce((prev, poll) => {
      prev[poll._id] = poll
      return prev
    }, {}),
  }
}

exports.getPollIds = getPollIds
exports.getPolls = getPolls