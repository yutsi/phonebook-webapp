const express = require('express')
const path = require('path')
const morgan = require('morgan')
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const personsRouter = require('./controllers/personsRouter')
const middleware = require('./utils/middleware')
const app = express()

app.use(cors())

app.use(express.json())

app.use(morgan('tiny'))

app.use(express.static(path.resolve(__dirname, './client/build')))

app.use(middleware.requestLogger)

app.use('/api/persons', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.listen(config.PORT)
logger.info(`Server running on port ${config.PORT}`)

if (config.NODE_ENV === 'test') {
  module.exports = app
}
