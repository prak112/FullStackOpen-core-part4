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
        const user = await User.findOne()
        const blogs = await Blog
                        .find({ user: user.id })
                        .populate('user', {username: 1, name: 1, id: 1})
        response.json(blogs)
    } 
    catch (error) {
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

// POST
exports.addBlog = async (request, response, next) => {
    try {
        const body = request.body
        // authenticate user token
        /*
         * from middleware.tokenExtractor use request.token
         * use jwt.verify to authenticate user
         * if invalid, return 401 status and message
         * if valid, get user from User collection   
        */
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if(!decodedToken){
            return response.status(401).json({ error: 'Invalid Token. User authentication failed.' })
        }
        const user = await User.findById(decodedToken.id)
        const blog = new Blog({
                            ...body,
                            user: user.id
                        })
        const addedBlog = await blog.save()

        user.blogs = user.blogs.concat(addedBlog._id)
        await user.save()
        console.log(`Blog - '${addedBlog.title}' added by User - '${user.username}'`)

        response.status(201).json(addedBlog)
    }
    catch(error) {
        next(error)
    }
}

// UPDATE
exports.updateBlog = async(request, response, next) => {
    try {
        const { title, author, url, likes } = request.body
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
            {title, author, url, likes},
            {new: true, runValidators: true, context: 'query'}
        )
        response.json(updatedBlog)
    } catch (error) {
        next(error)
    }
}

// DELETE
exports.removeBlog = async (request, response, next) => {
    /** user can only delete their blogs
     * retrieve user id from the existing blog
     * retrieve user id of client requesting delete 
        * decode token from request.token
        * retrieve user id from decodedToken  
        * verify userIdFromBlog === userIdFromToken ?
     * if invalid, return status 401 and error message
     * if valid, delete blog and return status 204 
    */
    try {
        const blogToDelete = await Blog.findById(request.params.id)
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        if(!decodedToken){
            response.status(401).json({ error: 'Invalid Token. User Authentication failed.' })
        }
        const userIdFromToken = decodedToken.id
        const userIdFromBlog = blogToDelete.user.id
        if(userIdFromToken !== userIdFromBlog){
            response.status(401).json({ error: 'Invalid request. User not authorized.'})
        }
        await Blog.findByIdAndDelete(blogToDelete.id)
        console.log(`Blog - '${blogToDelete.title}' deleted by User - '${decodedToken.username}'`)

        response.status(204).end()
    } catch (error) {
        next(error)
    }
}