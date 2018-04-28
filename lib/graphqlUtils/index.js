/**
 *
 * @param {object[].<function>} middlewares - an array of middlewares
 */
exports.runWithGraphqlMiddlewares = function(middlewares) {
  return async function(_, args, context) {
    let lastResult
    for (const middleware of middlewares) {
      lastResult = await middleware(_, args, context)
    }
    return lastResult
  }
}