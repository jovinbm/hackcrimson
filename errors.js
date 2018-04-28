/**
 *
 * @param {object} error
 * @param {number} error.code
 * @param {string} error.msg
 * @param [context={}]
 * @returns {object}
 */
const makeError = (error, context = {}) => {
  return {
    code: error.code,
    context: context,
    msg: error.msg,
  }
}

/**
 *
 * @param {object} error
 * @param {number} error.code
 * @param {string} error.msg
 * @param [context={}]
 * @returns Error
 */
const makeErrorInstance = (error, context = {}) => {
  const err = makeError(error, context)
  const errInstance = new Error(err.msg)
  Object.keys(err).map(key => {
    errInstance[key] = err[key]
  })
  return errInstance
}

const err = {
  NOT_AUTHENTICATED: {
    code: 1001,
    msg: 'User not authenticated. Please log in or register.',
  },
  NOT_AUTHORIZED: {
    code: 1002,
    msg: 'You are not authorized to perform this action.',
  },
  INVALID_TOKEN: {
    code: 1004,
    msg: 'Passed in token is either invalid or expired.',
  },
  EXPIRED_TOKEN: {
    code: 1007,
    msg: 'The passed in token is expired.',
  },
  MISSING_FIELD: {
    code: 1008,
    msg: 'A certain field is missing.',
  },
  INVALID_FIELD: {
    code: 1009,
    msg: 'A certain field is invalid.',
  },
  DUPLICATE: {
    code: 1010,
    msg: 'An item with a similar detail already exists',
  },
  SERVER_ERROR: {
    code: 3001,
    msg: 'There was an error on the server.',
  },
  OBJECT_NOT_FOUND: {
    code: 5001,
    msg: 'A certain object was not found. Please check your inputs.',
  },
}

exports.makeError = makeError
exports.makeErrorInstance = makeErrorInstance
exports.err = err
