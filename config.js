module.exports = {
  appName: 'LVote API',
  serviceName: 'LVote Voting',
  appDomain: 'lvote-api-staging.herokuapp.com',
  appUrl: 'https://lvote-api-staging.herokuapp.com/',
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://jovinbm:haha1995@ds261479.mlab.com:61479/lvote',
  sampleToken: 'abcde',
}