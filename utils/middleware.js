// imports - user authentication
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/user')

// load Middleware (VERY PARTICULAR ORDER)
const logger = require('./logger')
const morgan = require('morgan')
const requestLogger = morgan('dev')

// ONLY for testing/development purposes - POST method
/* 
* morgan.token('body', (req, res) => JSON.stringify(req.body) );
* app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
*/


// httpOnly cookie from request Header
const tokenExtractor = (request, response, next) => {
    request.token = request.cookies['auth_token']
    next()
}

// retrieve and validate user with JWT
const userExtractor = async (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken){
        return response.status(401).json({ error: 'Invalid Token. User authentication failed.' })
    }
    request.user = await User.findById(decodedToken.id)
    next()
}

// Endpoint handler
const unknownEndpoint = (request, response, next) => {
    response.status(404).send({error: 'Unkown Endpoint'})
    next()
}

// Error Handler - ALWAYS loaded last in app.js
const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if(error.name === 'CastError'){
        response.status(400).send({ error: 'Malformed request syntax / Invalid request framing' })
    }
    else if(error.name === 'ValidationError'){
        response.status(400).send({ error: error.message })
    }
    else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
        response.status(400).json({ error: 'Expected `username` to be unique' })
    }
    else if(error.message.includes('ValidationError: Password must not be empty/Password must be atleast 3 characters long')){
        response.status(401).json({ error: error.message })
    }
    else if(error.name === 'JsonWebTokenError') {
        response.status(401).json({ error: 'Invalid Token. User authentication failed.' })
    }
    else if(error.name === 'TokenExpiredError') {
        response.status(401).json({ error: 'Token expired. Login again.' })
    }
    next(error)
}


// export to app.js
module.exports = { requestLogger, tokenExtractor, userExtractor, unknownEndpoint, errorHandler }