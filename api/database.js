'use strict';

const mongoose = require('mongoose')
const config = require('./config/environment')

mongoose.Promise = global.Promise
mongoose.connect(config.mongodb.uri)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

module.exports.db = db
