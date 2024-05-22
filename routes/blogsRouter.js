// import Express router, blogsController
const router =  require('express').Router()
const blogsController = require('../controllers/blogsController')

// setup routes/HTTP requests
router.get('/', blogsController.getAllBlogs)
router.get('/:id', blogsController.getBlogById)

router.post('/', blogsController.addBlog)

router.put('/:id', blogsController.updateBlog)

router.delete('/:id', blogsController.removeBlog)

// export to app
module.exports = router