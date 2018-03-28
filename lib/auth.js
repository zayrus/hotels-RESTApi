'use strict'

let JwtStrategy = require('passport-jwt').Strategy
let ExtractJwt = require('passport-jwt').ExtractJwt

// load up the user model
const UserModel = require('../api/models/user').User
const config = require('../api/config/environment')

module.exports = function(passport) {
  let opts = {}

  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
  opts.secretOrKey = config.jwt.secret

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    UserModel.findOne({_id: jwt_payload._id}, function(err, user) {
      if (err) {
        console.log('err')
        return done(err, false)
      }
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    })
  }))
}
