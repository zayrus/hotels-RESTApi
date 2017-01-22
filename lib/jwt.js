'use strict'

let jwt = require('jwt-simple')

function Tokens(main) {
    this.config = main.config
}

Tokens.prototype.genJwt = function(obj, body) {
  let self = this
  
  return new Promise( (resolve, reject) => {
    
    obj.comparePassword(body.password, (err, isMatch) => {
      
      if (isMatch && !err) {
        let token = jwt.encode(obj, self.config.jwt.secret)
        resolve({success: true, token: 'JWT ' + token})
      } else {
        resolve({success: false, msg: 'Authentication failed.'})
      }
    
    })
  
  })
}

Tokens.prototype.getToken = function (headers) {
  let self = this
  let token, decode
  
  if (headers && headers.authorization) {
    let parted = headers.authorization.split(' ')
    if (parted.length === 2) {
      token = parted[1]
    } else {
      token = null
    }
  } else {
    token = null
  }
  
  decode = jwt.decode(token, self.config.jwt.secret)
  return decode
}

module.exports = Tokens
