// import DB schema
const { response } = require('express')
const Blog = require('../models/blog')

exports.getAllBlogs = (request, response, next) => {
    Blog.find({})
        .then(blogs => {
            response.json(blogs)
        })
        .catch(error => next(error))
}

exports.addBlog = (request, response, next) => {
    const blog = new Blog(request.body)
    blog.save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => next(error))
}