// imports
const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

// superagent object
const userAPI = supertest(app)

// initialize testDB
describe('When DB has one initial user', () => {
    beforeEach(async() => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('smo0K|n!', 10)
        const user = new User({
            username: 'root',
            name: 'super user',
            passwordHash: passwordHash
        })
        await user.save()
    })

    test('User registration with valid parameters succeeds', async() => {
        const usersBeforeRegistration = await helper.usersInDB()

        const newUser = {
            username: 'dvader',
            name: 'Darth Vader',
            password: 'Il0v3Gr|mRe@p3R!'
        }
        await userAPI
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

        // confirm registration success
        const usersAfterRegistration = await helper.usersInDB()
        assert.strictEqual(usersAfterRegistration.length, usersBeforeRegistration.length + 1)

        const usernames = usersAfterRegistration.map(user => user.username)
        assert(usernames.includes(newUser.username))
    })

    test('User registration with invalid username fails', async() => {
        const usersBeforeRegistration = await helper.usersInDB()

        const invalidUsername = {
            username: 'root',
            name: 'Ultra Super User',
            password: 'I@mGR0oT!'
        }
        const result = await userAPI
                                .post('/api/users')
                                .send(invalidUsername)
                                .expect(400)
                                .expect('Content-Type', /application\/json/)

        // confirm registration failure
        const usersAfterRegistration = await helper.usersInDB()
        assert.strictEqual(usersAfterRegistration.length, usersBeforeRegistration.length)

        assert(result.body.error.includes('Expected `username` to be unique'))
    })

    // invalid password test
    test('User registration with invalid password fails', async() => {
        const usersBeforeRegistration = await helper.usersInDB()

        const invalidPassword = {
            username: 'groot',
            name: 'Crazy Super User',
            password: 'no'
        }
        const result = await userAPI
                                .post('/api/users')
                                .send(invalidPassword)
                                .expect(401)
                                .expect('Content-Type', /application\/json/)
        
        // confirm registration failure
        const usersAfterRegistration = await helper.usersInDB()
        assert.strictEqual(usersAfterRegistration.length, usersBeforeRegistration.length)

        assert(result.body.error.includes('ValidationError: Password must not be empty/Password must be atleast 3 characters long'))
    })
})