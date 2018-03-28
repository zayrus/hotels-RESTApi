const mongoose = require('mongoose')
//const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const validateEmail = username => {
  let re = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
  return re.test(username)
}

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    validate: [validateEmail, 'Please fill valid email']
  },
  password: {
    type: String,
    required: true
  },
  role: String,
  active: Number
})

//not use arrow operator for the callback, these changes the scope of this
UserSchema.pre('save', function (next) {
  let username = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err)
      }
      bcrypt.hash(username.password, salt, (err, hash) => {
        if (err) {
          return next(err)
        }
        username.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

UserSchema.methods.comparePassword = function(passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }
    cb(null, isMatch)
  })
}
UserSchema.methods.validPassword = function(pwd) {
  return ( this.password === pwd )
}

const UserModel = mongoose.model('User', UserSchema)

module.exports.User = UserModel
