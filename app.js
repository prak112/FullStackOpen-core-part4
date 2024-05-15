// initial setup
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // error handler for async/await
const app = express()
const cors = require('cors')
const blogsRouter = require('./routes/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

// connect DB
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const MONGODB_URI = config.MONGODB_URI

mongoose.connect(MONGODB_URI)
        .then(() => {
            logger.info('Connected to MongoDB')
        })
        .catch((error) => {
            logger.error('Error connecting to MongoDB!\n', error.message)
        })

// load Middleware (VERY PARTICULAR ORDER)
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

// redirect HTTP methods to router
app.use('/api/blogs', blogsRouter)

// Error Handlers
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// export to index
module.exports = app