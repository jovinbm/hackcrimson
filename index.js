/* eslint-disable no-console */
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const config = require('./config')
const routes = require('./routes')

// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUrl)

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(function(req, res, next) {
  let oneof = false
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    oneof = true
  }
  if (req.headers['access-control-request-method']) {
    res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method'])
    oneof = true
  }
  if (req.headers['access-control-request-headers']) {
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'])
    oneof = true
  }
  if (oneof) {
    res.header('Access-Control-Max-Age', String(60 * 60 * 24 * 365))
  }
  
  // intercept OPTIONS method
  if (oneof && req.method === 'OPTIONS') {
    return res.sendStatus(200)
  } else {
    return next()
  }
})
app.use('/', routes)

// handle 404
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// production error handler
app.use(function(err, req, res, next) {
  console.log(err)
  res.status(err.status || 500).send()
})

const server = app.listen(config.port)
console.log('Listening at http://localhost:%s in %s mode', server.address().port, app.get('env'))

module.exports = app
