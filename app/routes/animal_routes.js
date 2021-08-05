// require express and passport for use
const express = require('express')
const passport = require('passport')

// import animal model
const Animal = require('./../models/animal')

// use express router
const router = express.Router()

// error handlers
// 404 when document is non-existent.
// require when non-owner tries to modify resource
const {handle404, requireOwnership} = require('../../lib/custom_errors')

// middleware
// removes blank fields from 'req.body'
const removeBlanks = require('../../lib/remove_blank_fields')
// uses bearer token authentication with passport
const requireToken = passport.authenticate('bearer', {
  session: false})

// index of animals
router.get('/animals', requireToken, (req, res, next) => {
  Animal.find({owner: req.user.id})
    .then(animals => {
      // changes mongoose docs to javascript objects
      return animals.map(animal => animal.toObject())
    })
    .then(animal => res.status(200).json({ animal }))
    .catch(next)
})

// read single animal
router.get('/animals/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Animal.findById(id)
    .then(handle404)
    .then(animal => requireOwnership(req, animal))
    .then(animal => res.status(200).json({ animal }))
    .catch(next)
})
// create animal
router.post('/animals', requireToken, (req, res, next) => {
  const animalData = req.body.animal
  animalData.owner = req.user.id
  Animal.create(animalData)
    .then(animal => res.status(201).json({ animal }))
    .catch(next)
})

// update animal authenticated
router.patch('/animals/:id', requireToken, removeBlanks, (req, res, next) => {
  // If try to change owner property, will delete
  // key/value pair
  delete req.body.animal.owner
  const id = req.params.id
  Animal.findById(id)
    .then(handle404)
    .then(animal => requireOwnership(req, animal))
    .then(animal => {
      return animal.updateOne(req.body.animal)
    })
    .then(animal => res.status(200).json({animal}))
    .catch(next)
})

// delete animal only if owned by signed in user
router.delete('/animals/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Animal.findById(id)
    .then(handle404)
    .then(animal => {
      requireOwnership(req, animal)
      return animal.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
