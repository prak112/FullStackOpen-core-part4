// imports
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

// Pseudocode
/*
 * retrieve username, password from request
 * retrieve user with username from DB
 * verify passwordHash and given password
 * if invalid, return status 401 and error message
 * if valid, generate token, return status 200 and assign token to username
 * export loginRouter
*/     

loginRouter.post('/', async(request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username: username })
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)
    
    if(!(user && passwordCorrect)){
        return response.status(401)
                .json({error: 'Invalid username/password'})
    }

    const userToAuthenticate = {
        username: user.username,
        id: user._id
    }
    // limit JWT validity to 10 hours
    const token = jwt.sign(
                        userToAuthenticate, 
                        process.env.SECRET, 
                        {expiresIn: 60 * 600})

    // use httpOnly cookie to wrap JWT
    response.cookie('auth_token', token, {
        httpOnly: true,
        secure: false,  // true if https
        maxAge: 60 * 600 * 1000, // match token expiration
        sameSite: 'strict' // based on cross-site request needs
    })
    
    return response
                .status(200)
                .send({ username: user.username, name: user.name })
})

module.exports = loginRouter