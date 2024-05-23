// import DB schema
require('dotenv').config()
const { request, response } = require('express')
require('express-async-errors')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const user = require('../models/user')

// use auth-scheme 'Bearer' for token
/**
 * request Header => Authorization => <auth-scheme> <auth-parameters>
 */
const getUserToken = (request) => {
    const authHeader = request.get('authorization')
    if(authHeader && authHeader.startsWith('Bearer ')){
        const token = authHeader.split(' ')[1]
        return token
    }
    return null
}


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
         * use getUserToken
         * use jwt.verify to authenticate user
         * if invalid, return 401 status and message
         * if valid, get user from User collection   
        */
        const decodedToken = jwt.verify(getUserToken(request), process.env.SECRET)
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
    try {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
}