'use strict'

function users(main) {
  return {
    add: (req, res, next) => {
      main.libs.Users.add(req.body) 
      .then( user => {
        res.json(user)
      })
      .catch(next)
    }
  }
} 

module.exports = users
