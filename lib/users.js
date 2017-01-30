'use strict'

let UserModel = require('../api/models/user').User

function Users(main) {
    this.db = main.db
}

Users.prototype.add = function(obj) {
  let addUser = new UserModel(obj)
  let promise = addUser.save()
  
  return promise
}

Users.prototype.find = function(obj) {
  let username = obj.username
  let query = UserModel.findOne({ username: username })
  
  return query
}

module.exports = Users
