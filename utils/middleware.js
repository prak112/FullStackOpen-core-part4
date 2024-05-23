const logger = require('./logger')

// load Middleware (VERY PARTICULAR ORDER)
const morgan = require('morgan')
const requestLogger = morgan('dev')

// ONLY for development purposes - POST method
// morgan.token('body', (req, res) => JSON.stringify(req.body) );
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// Endpoint handler
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'Unkown Endpoint'})
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
        response.status(500).json({ error: error.message })
    }
    next(error)
}

// export to app.js
module.exports = { requestLogger, unknownEndpoint, errorHandler }