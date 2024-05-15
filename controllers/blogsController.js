// import DB schema
const { request, response } = require('express')
require('express-async-errors')
const Blog = require('../models/blog')

exports.getAllBlogs = async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
    } 
    catch(error) {
        next(error)
    }
}

exports.getBlogById = async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if(blog){
            response.json(blog)
        }
        else{
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
}

exports.addBlog = async (request, response, next) => {
    try {
        const blog = new Blog(request.body)
        const result = await blog.save()
        response.status(201).json(result)
    }
    catch(error) {
        next(error)
    }
}

exports.removeBlog = async (request, response, next) => {
    try {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
}