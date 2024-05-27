// import Express router, blogsController
const router =  require('express').Router()
const blogsController = require('../controllers/blogsController')
const middleware = require('../utils/middleware')

// setup routes/HTTP requests
router.get('/', blogsController.getAllBlogs)
router.get('/:id', blogsController.getBlogById)

router.post('/', middleware.userExtractor, blogsController.addBlog)

router.put('/:id', middleware.userExtractor, blogsController.updateBlog)

router.delete('/:id', middleware.userExtractor, blogsController.removeBlog)

// export to app
module.exports = router