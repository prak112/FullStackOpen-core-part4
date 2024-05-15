const _ = require('lodash')

// verify Test setup
const dummy = (blogs) => {
    return 1
}

// template for favoriteBlog and mostLikes
function infoTemplate(...args) {
    const [title, author, likes] = args
    let result = {}
    if(title !== '') result.title = title
    if(author !== '') result.author = author
    if(likes !== NaN) result.likes = likes

    return result;
}

// total likes of blogposts
const totalLikes = (blogs) => {
    const totalBlogs = blogs.length

    switch (totalBlogs) {
        case 0:
            return 0;
        case 1:
            return blogs[0].likes;
        default:
            return blogs.reduce((sum, blog) => {
                return sum + blog.likes;
            }, 0);
    }
}

// Info of blog with most likes
const favoriteBlog = (blogs) => {
    const totalBlogs = blogs.length
    
    switch(totalBlogs){
        case 0:
            return {};
        case 1:
            const firstBlog = infoTemplate(blogs[0].title, blogs[0].author, blogs[0].likes);
            return firstBlog;
        default:
            // sort in descending order
            blogs.sort((blogA, blogB) => blogB.likes - blogA.likes)
            const topBlog = infoTemplate(blogs[0].title, blogs[0].author, blogs[0].likes);
            return topBlog;
    }
}

const mostLikes = (blogs) => {
    const totalBlogs = blogs.length

    switch(totalBlogs){
        case 0:
            return {};
        case 1:
            const firstBlog = infoTemplate('', blogs[0].author, blogs[0].likes);
            return firstBlog;
        default:
            // sort in descending order
            blogs.sort((blogA, blogB) => blogB.likes - blogA.likes)
            const topBlog = infoTemplate('', blogs[0].author, blogs[0].likes);
            return topBlog;
    }
}

// Info of author with most blogs
const mostBlogs = (blogs) => {
    if(blogs.length === 0) { return {} }

    const blogsByAuthors = _.groupBy(blogs, 'author')
    console.log(blogsByAuthors)
    let maxBlogs = 0
    let mostBloggedAuthor = ''
    
    for(let author in blogsByAuthors) {
        if(blogsByAuthors[author].length > maxBlogs) {
            maxBlogs = blogsByAuthors[author].length
            mostBloggedAuthor = author
        }
    }
    return {
        author: mostBloggedAuthor,
        blogs: maxBlogs
    }
}


// export to list_helper.test.js
module.exports = { dummy, totalLikes, favoriteBlog, mostLikes, mostBlogs }