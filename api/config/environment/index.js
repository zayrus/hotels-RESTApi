'use strict'

var _ = require('lodash')

// All configurations will extend these options
var all = {
  env: process.env.NODE_ENV || 'development',

  // Server port
  port: process.env.PORT || 10010,

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
}

// Export the config object based on the NODE_ENV
module.exports = _.merge(
  all,
  require('./shared'),
  require('./' + all.env + '.js') || {})
