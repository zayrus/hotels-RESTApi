'use strict'

const express = require('express')
const http = require('http')
const swaggerTools = require('swagger-tools')
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const passport = require('passport')
const Users = require('../lib/users')
const Tokens = require('../lib/jwt')
const Hotels = require('../lib/hotels')
const auth = require('../lib/auth')
const cors = require('cors')
const database = require('../api/database')

/**
 * Build Main aplication
 * @param {object} config
 * @return {Promise}
 */ 
function app(config) {
  let self = this
  self.main = {
    config: config,
    db: database.db,
    auth: auth
  }
  return new Promise( (resolve, reject) => {
    self.swaggerDoc()
      .then( () => { return self.getApp() })
      .then( () => { return self.libs() })
      .then( () => { return self.controllers() })
      .then( () => { return self.routers()  })
      .then( () => { 
        resolve(self.main)
      })
    .catch( err => {
      console.log('Error on init ', err)
      reject(err)
    })
  })
}

/**
 * Create the express instance an inject into main property the instance and server
 * @returns {Promise}
 */
app.prototype.getApp = function() {
  let self = this
  return new Promise( (resolve) => {
    self.main.app = express()
    self.main.app.set('trust proxy', 1)
    self.main.server = http.createServer(self.main.app)
    resolve({app: self.main.app, server: self.main.server})
  })
}
 
/**
 * inject swagger doc into main object.
 * @returns {Promise}
 */
app.prototype.swaggerDoc = function () {
  let self = this
  return new Promise((resolve) => {
    var swaggerFile = path.join(__dirname, '../api/swagger/swagger.yaml')
    var swaggerString = fs.readFileSync(swaggerFile, 'utf8')
    var swaggerDoc = yaml.safeLoad(swaggerString)
    swaggerDoc.host = self.main.config.service.host
    swaggerDoc.basePath = self.main.config.service.pathname

    self.main.swaggerDoc = swaggerDoc
    resolve({swaggerDoc: swaggerDoc})
  })
}

/**
 * inject routers
 * @returns {Promise}
 */
app.prototype.routers = function() {
  let self = this
  return new Promise( (resolve) => {
    let app = self.main.app
    let options = {
      controllers: self.main.controllers
    }
    
    app.use(cors())
    let formatValidationError = function formatValidationError(err, req, res, next) {
      let error = {
        code: 'validation_error',
        message: err.message,
        details: err.results ? err.results.errors : null
      }
      res.json({error: error})
    }
    
    function initMiddleWare(middleware, callback) {
      app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
        res.setHeader('Access-Control-Allow-Credentials', true)
      
        if (req.method === 'OPTIONS') return res.end()
        next()
      })
      
      app.use(middleware.swaggerMetadata())
      app.use(middleware.swaggerValidator(), formatValidationError)
      app.use(passport.initialize()) 
      app.use(passport.session())
      require('../lib/auth')(passport)
      
      app.use(middleware.swaggerRouter(options))
      
      app.use((err, req, res, next) => {
        res.status(500)
        res.send(err)
        res.end()
      })

      app.use(middleware.swaggerUi()) 

      callback()
    }
    swaggerTools.initializeMiddleware(self.main.swaggerDoc,  (swaggerMiddleware) =>{
      initMiddleWare(swaggerMiddleware, () => {
        resolve()
      })
    })
  })
}  

/**
 * Create the common lib instances for all REST Application
 * @returns {Promise}
 */
app.prototype.libs = function () {
  var self = this
  return new Promise( (resolve) => {

    self.main.libs = {
      Users:  new Users(self.main),
      Tokens:  new Tokens(self.main),
      Hotels:  new Hotels(self.main)
    }
    resolve(self.main.libs)
  })
}

app.prototype.controllers = function () {
  var self = this
  //var controllers = {}

  return new Promise((resolve) => {
    self.main.controllers = require('./controllers')(self.main)
    resolve(self.main.controllers)
  })
}

module.exports = app

