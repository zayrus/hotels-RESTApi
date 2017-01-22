var mongoose  = require('mongoose')
var Schema    = mongoose.Schema

var HotelsSchema = new Schema({
  name: String,
  stars: Number,
  price: Number
})

const HotelModel = mongoose.model('Hotel', HotelsSchema)

module.exports.Hotel = HotelModel

