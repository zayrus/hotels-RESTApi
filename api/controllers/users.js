'use strict'

function users(main) {
  return {
    add: (req, res, next) => {
      main.libs.Users.add(req.body) 
      .then( user => {
        res.json(user)
      })
      .catch(next)
    },
    search: (req, res, next) => {
      let authToken = main.libs.Tokens.getToken(req.headers)
      let id = req.swagger.params.id.value
      
      let searchOneUser = function() {
        main.libs.Users.search(id)
        .then( user => {
          res.json(user)
        })
        .catch(next)
      }
      
      if (authToken) {
        main.libs.Users.find(authToken)
        .then( user => {
          if (user) {
            searchOneUser()
          }
        })
      }
      
    }
    /*list: (req, res, next) => {
      let listPromise = new Promise ( (resolve, reject) => { 
        let authToken = main.libs.Tokens.getToken(req.headers)
        resolve(authToken)
      }).then( (token) => {
        return main.libs.Users.find(token)
      }).then( (user) => {
        return main.libs.Users.list(req.body)
      }).then( (users) => {
          res.json(users)
      }).catch(next)
    } */
  }
} 

module.exports = users
