// imports
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// setup verification
test('dummy returns 1', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

// test condition variables
const emptyBlog = []

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
]

const multipleBlogs = [
    {
        "title": "MERN-150 Days Challenge",
        "author": "Prakirth Govardhanam",
        "url": "https://dev.to/prakirth/mern-150-days-challenge-27o8",
        "likes": 1,
        "id": "66432eea2c05f0b5d4627ac9"
    },
    {
        "title": "What I learned from writing 30 articles in a row",
        "author": "Steeve",
        "url": "https://dev.to/steeve/what-i-learned-from-writing-30-articles-in-a-row-ae1",
        "likes": 15,
        "id": "66432f682c05f0b5d4627acb"
    },
    {
        "title": "How to Build in Public as a Tech Professional",
        "author": "Pieces",
        "url": "https://dev.to/get_pieces/how-to-build-in-public-as-a-tech-professional-2epl",
        "likes": 16,
        "id": "66435e27697758bc8a6cfda1"
    }
]



// total likes of all blogposts in different conditions
describe('Total Likes', () => {
    const totalLikes = listHelper.totalLikes

    // empty list
    test('of empty list is zero', () => {
        assert.strictEqual(totalLikes(emptyBlog), 0)
    })

    // single list item
    test('of list with a single blogpost will return its likes', () => {
        assert.strictEqual(totalLikes(listWithOneBlog), 5)
    })


    // multiple items in blogs list
    test('of list of many blogposts is calculated right', () => {
        assert.strictEqual(totalLikes(multipleBlogs), 32)
    })
})


// blogpost with maximum likes
describe('Most Liked blog', () => {
    const favoriteBlog = listHelper.favoriteBlog

    // empty list
    test('when list is empty', () => {
        assert.deepStrictEqual(favoriteBlog(emptyBlog), {})
    })

    // single item
    const firstBlog = {
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5
    }
    test('when only one blog in list', () => {
        assert.deepStrictEqual(favoriteBlog(listWithOneBlog), firstBlog)
    })

    // multiple items
    const topBlog =     {
        "title": "How to Build in Public as a Tech Professional",
        "author": "Pieces",
        "likes": 16
    }
    test('when multiple blogs in list', () => {
        assert.deepStrictEqual(favoriteBlog(multipleBlogs), topBlog)
    })
})


