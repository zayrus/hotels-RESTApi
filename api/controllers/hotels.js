'use strict'
function hotels(main){
  return {
    add: (req, res, next) => {
      console.log('try add hotel')
      main.libs.Hotels.add(req.body)
      .then( hotel => {
        res.json(hotel)
      }) 
      .catch(next)
    },
    list: ( req, res, next) => {
      main.libs.Hotels.list(req.body)
      .then( hotels => {
        res.json(hotels)
      })
      .catch(next)
    },
    search: (req, res, next) => {
      let id = req.swagger.params.id.value
      main.libs.Hotels.search(id)
      .then( hotel => {
        res.json(hotel)
      })
      .catch(next)
    },
    update: (req, res, next) => {
      let id = req.swagger.params.id.value
      main.libs.Hotels.update(id, req.body)
      .then( hotel => {
        res.json(hotel)
      })
      .catch(next)
    },
    remove: (req, res, next) => {
      let id = req.swagger.params.id.value
      main.libs.Hotels.delete(id)
      .then( () =>{
        res.json({msg: 'hotel deleted'})
      })
      .catch(next)
    
    }
  }
}

module.exports = hotels

