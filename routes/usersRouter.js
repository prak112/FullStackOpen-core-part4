// imports
const router = require('express').Router()  // express' Router module
const usersController = require('../controllers/usersController')

// setup request routes
router.get('/', usersController.getAllUsers )
router.post('/', usersController.registerUser)


module.exports = router