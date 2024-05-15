// import Express router, blogsController
const router =  require('express').Router()
const blogsController = require('../controllers/blogsController')

// setup routes/HTTP requests
router.get('/', blogsController.getAllBlogs)
router.get('/:id', blogsController.getBlogById)

router.post('/', blogsController.addBlog)

router.delete('/:id', blogsController.removeBlog)

module.exports = router