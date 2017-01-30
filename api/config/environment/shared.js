'use strict'

exports = module.exports = {
  'db': '127.0.0.1/users',
  'server': {
    'dbConnectionRetry': true,
    'maxConnectionRetryTime': 60,
    'port': 10010
  },
  'app':{
    'url': 'http://127.0.0.1/'
  },
  'service':{
    'protocol': 'http://',
    'host': 'localhost:10010',
    'pathname': '/'
  },
}
