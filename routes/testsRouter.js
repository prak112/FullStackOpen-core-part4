// imports
const router = require('express').Router()
const testController = require('../controllers/testsController')

// setup routes
router.post('/reset', testController.resetTestDb)


module.exports = router