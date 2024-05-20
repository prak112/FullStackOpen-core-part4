// imports
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

// define superagent object
const blogAPI = supertest(app)

// initialize data in testDB
const totalBlogs = helper.initialBlogs.length

describe('When DB data is initialized', () => {
    beforeEach(async() => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })
    
    
    // test GET request
    describe('HTTP GET method returns', () => {
        test('Blog post info as JSON', async () => {
            await blogAPI
                    .get('/api/blogs')
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
    
            await blogAPI
                .post('/api/blogs')
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
            await blogAPI
                    .post('/api/blogs')
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
            await blogAPI
                    .post('/api/blogs')
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
            await blogAPI
                    .post('/api/blogs')
                    .send(blogWithoutLikes)
                    .expect(201)
            
            // confirm total blogs changed
            const response = await blogAPI.get('/api/blogs')
            const blogsInDb = await helper.blogsInDB()
            assert.strictEqual(response.body.length, blogsInDb.length)
        })
    })
    
    
    // test DELETE request
    describe('HTTP DELETE method', () => {
        test('deletes existing blogpost and return status 204 if ID is valid', async() => {
            const blogsBeforeDelete = await helper.blogsInDB()
            const blogToDelete = blogsBeforeDelete[0]
    
            await blogAPI.delete(`/api/blogs/${blogToDelete.id}`)
                         .expect(204)
                    
            // confirm delete
            const blogsAfterDelete = await helper.blogsInDB()
            assert.strictEqual(blogsAfterDelete.length, helper.initialBlogs.length - 1)
            
            const titles = blogsAfterDelete.map(blog => blog.title)
            assert(!titles.includes(blogToDelete.title))
        })
    
        test('returns status 400 if ID is invalid/non-existing', async() => {
            const invalidId = 'invalid123'
            await blogAPI.delete(`/api/blogs/${invalidId}`)
                    .expect(400)
            
            // confirm total blogs are unchanged
            const response = await blogAPI.get('/api/blogs')
            assert.strictEqual(response.body.length, totalBlogs)
        })
    })
    
    
    // test PUT method
    describe('HTTP PUT method', () => {
        test('updates an existing blog if ID is valid', async() => {
            const blogsBeforeUpdate = await helper.blogsInDB()
            const blogToUpdate = blogsBeforeUpdate[0]
            const infoToUpdate = {
                title: 'React patterns in simplified format',
                author: 'Chantastic',
                url: 'https://reactpatterns.com/',
                likes: 10
            }
    
            await blogAPI.put(`/api/blogs/${blogToUpdate.id}`)
                    .send(infoToUpdate)
                    .expect(200)
    
            // confirm updated blog info
            const updatedBlogInDB = await Blog.findById(blogToUpdate.id)
            assert.strictEqual(updatedBlogInDB.title, infoToUpdate.title)
            assert.strictEqual(updatedBlogInDB.author, infoToUpdate.author)
            assert.strictEqual(updatedBlogInDB.url, infoToUpdate.url)
            assert.strictEqual(updatedBlogInDB.likes, infoToUpdate.likes)
        })
    
        test('returns status 404 if ID is invalid/non-existing', async() => {
            const nonExistingId = 'nonexisting123'
            const infoToUpdate = {
                title: 'React patterns in simplified format',
                author: 'Chantastic',
                url: 'https://reactpatterns.com/',
                likes: 10
            }
            await blogAPI.put(`/api/blogs${nonExistingId}`)
                    .send(infoToUpdate)
                    .expect(404)    
        })
    
        test('returns status 400 if information to update is invalid', async() => {
            const blogsBeforeUpdate = await helper.blogsInDB()
            const blogToUpdate = blogsBeforeUpdate[0]
            const invalidInfo = {
                title: '',
                author: 12345,
                url: 'https://example.com/',
                likes: 10
            }
            
            await blogAPI.put(`/api/blogs/${blogToUpdate.id}`)
                    .send(invalidInfo)
                    .expect(400)
            
            // confirm blog info unchanged
            const updatedBlogInDB = await Blog.findById(blogToUpdate.id)
            assert.notStrictEqual(updatedBlogInDB.title, invalidInfo.title)
            assert.notStrictEqual(updatedBlogInDB.author, invalidInfo.author)
            assert.notStrictEqual(updatedBlogInDB.url, invalidInfo.url)
            assert.notStrictEqual(updatedBlogInDB.likes, invalidInfo.likes)    
        })
    })    
})

// close testDB connection
after(async() => {
    await mongoose.connection.close()
    console.log('Disconnected from MongoDB\n')
})