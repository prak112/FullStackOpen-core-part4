// import Express router, blogsController
const router =  require('express').Router()
const blogsController = require('../controllers/blogsController')

// setup routes/HTTP requests
router.get('/', blogsController.getAllBlogs)

router.post('/', blogsController.addBlog)

module.exports = router