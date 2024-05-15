// imports
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// setup verification
describe('Test setup verification', () => {
        test('dummy returns 1', () => {
        const blogs = []
        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
    })
})

// test condition variables
const emptyBlog = []

const listWithOneBlog = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
      }
]

const multipleBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 1,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
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
        assert.strictEqual(totalLikes(multipleBlogs), 37)
    })
})


// blogpost with maximum likes - title, author, likes
describe('Most Liked blog', () => {
    const favoriteBlog = listHelper.favoriteBlog

    // empty list
    test('when list is empty', () => {
        assert.deepStrictEqual(favoriteBlog(emptyBlog), {})
    })

    // single item
    const firstBlog = {
        title: "React patterns",
        author: "Michael Chan",
        likes: 7,
    }
    test('when only one blog in list', () => {
        assert.deepStrictEqual(favoriteBlog(listWithOneBlog), firstBlog)
    })

    // multiple items
    const topBlog = {
        "title": "Canonical string reduction",
        "author": "Edsger W. Dijkstra",
        "likes": 12,
    }
    test('when multiple blogs in list', () => {
        assert.deepStrictEqual(favoriteBlog(multipleBlogs), topBlog)
    })
})


// blogpost with most likes - author, likes
describe('Most Liked blog', () => {
    const mostLiked = listHelper.mostLikes

    // empty list
    test('when list is empty', () => {
        assert.deepStrictEqual(mostLiked(emptyBlog), {})
    })

    // single item
    const firstBlog = {
        author: "Michael Chan",
        likes: 7,
    }
    test('when only one blog in list', () => {
        assert.deepStrictEqual(mostLiked(listWithOneBlog), firstBlog)
    })

    // multiple items
    const topBlog =     {
        "author": "Edsger W. Dijkstraeces",
        "likes": 12
    }
    test('when multiple blogs in list', () => {
        assert.deepStrictEqual(mostLiked(multipleBlogs), topBlog)
    })
})


// most blogged author - author, blogs
describe('Author of most blogs', () => {
    const mostBlogged = listHelper.mostBlogs

    // empty list
    test('when list is empty', () => {
        assert.deepStrictEqual(mostBlogged(emptyBlog), {})
    })

    // single item
    const firstBlog = {
        author: "Michael Chan",
        blogs: 1
    }
    test('when only one blog in list', () => {
        assert.deepStrictEqual(mostBlogged(listWithOneBlog), firstBlog)
    })

    // multiple items
    const topBlog =     {
        "author": "Robert C. Martin",
        "blogs": 3
    }
    test('when multiple blogs in list', () => {
        assert.deepStrictEqual(mostBlogged(multipleBlogs), topBlog)
    })
})