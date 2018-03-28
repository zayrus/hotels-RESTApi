/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "promise" }]*/
'use strict'
function hotels(main){
  return {
    add: (req, res, next) => {
      main.libs.Hotels.find(req.body)
        .then( hotel => {
          if (hotel) {
            throw('hotelex')
          }
          return main.libs.Hotels.add(req.body)
        })
        .then( hotel => {
          if (res.statusCode > 400) {
            throw(err)
          }
          res.json({message: "Hotel created"})
        })
        .catch( err => {
          let error = {}
          if (err == 'hotelex') {
            res.statusCode = 409
            error.message = 'resource already exists'
            return res.json(error)
          }
          res.statusCode = 400
          error.message = err.message
          return res.json(error)
        })
    },
    list: ( req, res, next) => {
      main.libs.Hotels.list(req.body)
        .then( hotels => {
          res.json(hotels)
        })
        .catch( err => {
          const error = {
            message: err.message,
          }
          if (res.statusCode == 200) {
            res.statusCode = 400
          }
          return res.json(error)
        })
    },
    search: (req, res, next) => {
      const id = req.swagger.params.id.value

      main.libs.Hotels.search(id)
        .then( hotel => {
          res.json(hotel)
        })
        .catch( err => {
          const error = {
            message: err.message,
          }
          if (res.statusCode == 200) {
            res.statusCode = 400
          }
          return res.json(error)
        })
    },
    update: (req, res, next) => {
      const id = req.swagger.params.id.value

      const promise = new Promise ( (resolve) => {
        const authToken = main.libs.Tokens.getToken(req.headers)
        resolve(authToken)
      })
        .then( (token) => {
          return main.libs.Users.find(token)
        })
        .then( () => {
          return main.libs.Hotels.update(id, req.body)
        })
        .then( (hotel) => {
          res.json(hotel)
        })
        .catch( err => {
          const error = {
            message: err.message,
          }
          if (res.statusCode == 200) {
            res.statusCode = 400
          }
          return res.json(error)
        })

    },
    remove: (req, res, next) => {
      const id = req.swagger.params.id.value

      const promise = new Promise ( (resolve) => {
        const authToken = main.libs.Tokens.getToken(req.headers)
        resolve(authToken)
      })
        .then( (token) => {
          return main.libs.Users.find(token)
        })
        .then( () => {
          return main.libs.Hotels.delete(id)
        })
        .then( () => {
          res.json({msg: 'hotel deleted'})
        })
        .catch( err => {
          if (res.statusCode == 200) {
            res.statusCode = 400
          }
          const error = {
            message: err.message || 'remove error',
          }
          return res.json(error)
        })

    }
  }
}

module.exports = hotels

