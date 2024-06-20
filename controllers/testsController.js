//imports
require('express-async-errors') // error-handling
const Blog = require('../models/blog')
const User = require('../models/user')

// handle HTTP requests
exports.resetTestDb = async(request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
}
