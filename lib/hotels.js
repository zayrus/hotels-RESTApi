'use strict'

let HotelsModel = require('../api/models/hotel').Hotel

function Hotels(main) {
  this.db = main.db
}

Hotels.prototype.add = function(obj) {
  let addHotel = new HotelsModel(obj)
  let promise = addHotel.save()
    
  return promise
}

Hotels.prototype.list = function(obj) {
  let query = HotelsModel.find({}, {_id: 0, __v: 0}).sort({price:1})
  
  return query
}

Hotels.prototype.search = function(id) {
  let query = HotelsModel.findOne({ _id: id })
  return query
}

Hotels.prototype.update = function(id, hotel) {
  let promise = HotelsModel.update({_id: id}, hotel)
  return promise
}

Hotels.prototype.delete = function(id) {
  let promise = HotelsModel.remove({_id: id})
  return promise
  
}

module.exports = Hotels
