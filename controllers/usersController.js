// error handling for async/await
require('express-async-errors')

// imports
const User = require('../models/user')
const bcrypt = require('bcryptjs')

// GET - registered users
exports.getAllUsers = async(request, response) => {
    const users = await User
                    .find({})
                    .populate('blogs', {title: 1, author: 1, url: 1})
    response.json(users)
}

// POST - register new users
exports.registerUser = async (request, response) => {
    const { username, name, password } = request.body
    if(!password || password.length < 3){
        throw new Error('ValidationError: Password must not be empty/Password must be atleast 3 characters long')   
        // ValidationError response code 500
    }
    const saltRounds = 10 // hashing algorithm execution rounds
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username: username,
        name: name,
        passwordHash: passwordHash
    })
    const savedUser = await user.save()
    response.status(201).json(savedUser)
}