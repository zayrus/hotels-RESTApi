'use strict';

require('dotenv').config()
const mongoose = require('mongoose')
const config = require('./config/environment')
const dbHost = process.env.DB_HOST

mongoose.Promise = global.Promise
mongoose.connect(dbHost)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

module.exports.db = db
