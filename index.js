const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// listen to network port
app.listen(config.PORT, () => {
    logger.info(`Server running at http://localhost:${config.PORT}`)
  })