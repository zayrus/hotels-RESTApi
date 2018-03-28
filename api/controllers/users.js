'use strict'

function users(main) {
  return {
    add: (req, res, next) => {
      main.libs.Users.find(req.body)
        .then( user => {
          if (user) {
            throw('userex')
          }
          return main.libs.Users.add(req.body)
        })
        .then( user => {
          if (res.statusCode > 400) {
            throw(err)
          }
          res.json({message: "user created"})
        })
        .catch( err => {
          let error = {}
          if (err == 'userex') {
            res.statusCode = 409
            error.message = 'resource already exists'
            return res.json(error)
          }
          res.statusCode = 400
          error.message = err.message
          return res.json(error)
        })
    }
  }
}

module.exports = users
