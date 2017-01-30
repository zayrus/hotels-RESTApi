/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "promise" }]*/
'use strict'
function hotels(main){
  return {
    add: (req, res, next) => {
      main.libs.Hotels.add(req.body)
      .then( hotel => {
        res.json(hotel)
      }) 
      .catch( err => {
        next(err)
      })
    },
    list: ( req, res, next) => {
      main.libs.Hotels.list(req.body)
      .then( hotels => {
        res.json(hotels)
      })
      .catch( err => {
        next(err)
      })
    },
    search: (req, res, next) => {
      const id = req.swagger.params.id.value
      
      main.libs.Hotels.search(id)
      .then( hotel => {
        res.json(hotel)
      })
      .catch( err => {
        next(err)
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
        next(err)
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
        next(err)
      })
    
    }
  }
}

module.exports = hotels

