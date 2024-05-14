// verify Test setup
const dummy = (blogs) => {
    return 1
}


// calculate total likes of blogposts
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
            const firstBlog = {
                title: blogs[0].title,
                author: blogs[0].author,
                likes: blogs[0].likes
            }
            return firstBlog;
        default:
            // sort in descending order
            blogs.sort((blogA, blogB) => blogB.likes - blogA.likes)
            const topBlog = {
                title: blogs[0].title,
                author: blogs[0].author,
                likes: blogs[0].likes
            }
            return topBlog;
    }
}


// export to list_helper.test.js
module.exports = { dummy, totalLikes, favoriteBlog }