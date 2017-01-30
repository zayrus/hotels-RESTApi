'use strict'

function auth(main) {
  return {
    login: (req, res, next) => {
      main.libs.Users.find(req.body) 
      .then( data => {
        if (!data) {
          res.json({code: 401, message: 'Authentication failed'})
        } else {
          main.libs.Tokens.genJwt(data, req.body)
          .then( matchResponse => {
            res.json(matchResponse)
          })
        }
      })
      .catch(next)
    }
  }
} 

module.exports = auth

