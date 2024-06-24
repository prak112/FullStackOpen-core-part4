// import DB schema
require('dotenv').config()
const { request, response } = require('express')
require('express-async-errors')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

// GET
exports.getAllBlogs = async (request, response, next) => {
    try {
        const allBlogs = await Blog
                            .find({})
                            .populate('user', {username: 1, name: 1, id: 1})
        response.json(allBlogs)
    } 
    catch (error) {
        next(error)    
    }
}

exports.getBlogById = async (request, response, next) => {
    try {
        const blog = await Blog
                        .findById(request.params.id)
                        .populate('user', {username: 1, name: 1, id: 1})
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

// POST
exports.addBlog = async (request, response, next) => {
    try {
        const body = request.body
        const user = request.user
        const blog = new Blog({
                            ...body,
                            user: user.id
                        })
        const addedBlog = await blog.save()

        // update User model with id of newly added blog
        user.blogs = user.blogs.concat(addedBlog._id)
        await user.save()
        console.log(`Blog - '${addedBlog.title}' added by User - '${user.name}'`)

        response.status(201).json(addedBlog)
    }
    catch(error) {
        next(error)
    }
}

// UPDATE
exports.updateBlog = async(request, response, next) => {
    try {
        const id = request.params.id
        const { title, author, url, likes } = request.body
        const options = { new: true, runValidators: true, context: 'query' }
        const updatedBlog = await Blog
            .findByIdAndUpdate(id, { title, author, url, likes }, options)
            .populate('user', {username: 1, name: 1, id: 1})

        response.json(updatedBlog)
    } catch (error) {
        next(error)
    }
}

// DELETE
exports.removeBlog = async (request, response, next) => {
    try {
        const id = request.params.id
        const blogToDelete = await Blog.findById(id)

        const userIdFromToken = request.user.id
        const userIdFromBlog = blogToDelete.user._id.toString()
        if(userIdFromToken !== userIdFromBlog){
            console.log(`Invalid request because ${userIdFromToken} != ${userIdFromBlog}` )
            response.status(401).json({ error: 'Invalid request. User not authorized.'})
        }
        else {
            await Blog.findByIdAndDelete(blogToDelete.id)
            console.log(`Blog - '${blogToDelete.title}' deleted by User - '${request.user.name}'`)    
            response.status(204).end()
        }
    } catch (error) {
        next(error)
    }
}