// error handling for async/await
require('express-async-errors')

// imports
const User = require('../models/user')
const bcrypt = require('bcryptjs')

// GET - registered users
exports.getAllUsers = async(request, response) => {
    const users = await User.find({})
    response.json(users)
}

// POST - register new users
exports.registerUser = async (request, response) => {
    const { username, name, password } = request.body
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