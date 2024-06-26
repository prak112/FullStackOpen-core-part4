// initial setup
const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // error handler for async/await
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const middleware = require('./utils/middleware')
app.use(middleware.tokenExtractor)
const blogsRouter = require('./routes/blogsRouter')
const usersRouter = require('./routes/usersRouter')
const loginRouter = require('./controllers/login')
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
if (process.env.NODE_ENV !== 'test'){
    app.use(middleware.requestLogger)
}

// redirect HTTP requests to routers
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

if(process.env.NODE_ENV === 'test'){
    const testsRouter = require('./routes/testsRouter')
    app.use('/api/testing', testsRouter)
}

// Error Handlers
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// export to index
module.exports = app