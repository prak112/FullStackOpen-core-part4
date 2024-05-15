// imports
const { test, describe, after, beforeEach } = require('node:test')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')


// define superagent object
const blogAPI = supertest(app)

// initialize data in testDB
const totalBlogs = helper.initialBlogs.length

beforeEach(async() => {
    await Blog.deleteMany({})
    // executed in no specific order
    for(let blog of helper.initialBlogs){
        let blogObject = new Blog(blog)
        await blogObject.save()
    }
    // // executed in specific order promises registred
    // await Promise.all(helper.initialBlogs.map(async (blog) => {
    // }))
})


// test GET request
describe('HTTP GET method returns', () => {
    test('Blog post info as JSON', async () => {
        await blogAPI.get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
    })
    
    test('Total blogs as 6', async() => {
        const response = await blogAPI.get('/api/blogs')
        assert.strictEqual(response.body.length, totalBlogs)
    })
})

// test POST request
describe('HTTP POST method', () => {
    test('adds blog with all properties to list', async() => {
        const newBlog = {
            title: 'Navigating Open Source: A Guide to Effective Community Engagement',
            author: 'Pachi',
            url: 'https://dev.to/buildwebcrumbs/navigating-open-source-a-guide-to-effective-community-engagement-5gb9',
            likes: 17
        }

        await blogAPI.post('/api/blogs')
                     .send(newBlog)
                     .expect(201)
                     .expect('Content-Type', /application\/json/)
        
        // confirm total blogs
        const response = await blogAPI.get('/api/blogs')
        assert.strictEqual(response.body.length, totalBlogs + 1)

        // confirm blog title
        const titles = response.body.map(blog => blog.title)
        assert(titles.some(title => /navigating open source/i.test(title)));
    })

    test('does not add blog without Title to list', async() => {
        const blogWithoutUrl = {
            title: '',
            author: 'Idk',
            url: 'https://thisdoesnotexist.nowhere.com',
            likes: 10
        }
        await blogAPI.post('/api/blogs')
                     .send(blogWithoutUrl)
                     .expect(400)

        // confirm total blogs are unchanged
        const response = await blogAPI.get('/api/blogs')
        assert.strictEqual(response.body.length, totalBlogs)
    })

    test('does not add blog without URL to list', async() => {
        const blogWithoutUrl = {
            title: 'This blog does not exist',
            author: 'Idk',
            url: '',
            likes: 10
        }
        await blogAPI.post('/api/blogs')
                     .send(blogWithoutUrl)
                     .expect(400)

        // confirm total blogs are unchanged
        const response = await blogAPI.get('/api/blogs')
        assert.strictEqual(response.body.length, totalBlogs)
    })

    test('adds blog without Likes to list', async() => {
        const blogWithoutLikes = {
            title: '9 Important React Hooks',
            author: 'Borneel B. Phukan',
            url: 'https://dev.to/borneelphukan/9-react-hooks-that-you-should-be-aware-of-as-a-frontend-developer-4c2m'
        }
        await blogAPI.post('/api/blogs')
                     .send(blogWithoutLikes)
                     .expect(201)
        
        // confirm total blogs changed
        const response = await blogAPI.get('/api/blogs')
        const blogsInDb = await helper.blogsInDB()
        assert.strictEqual(response.body.length, blogsInDb.length)
    })
})


// close testDB connection
after(async() => {
    await mongoose.connection.close()
    console.log('Disconnected from MongoDB\n')
})