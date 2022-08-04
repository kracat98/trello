const express = require('express')
const mongoose = require('mongoose')
require('express-async-errors')
const cors = require('cors')

const app = express()

// Routers
const boardsRouter = require('./controllers/boards')
const tablesRouter = require('./controllers/tables')
const tasksRouter = require('./controllers/tasks')

const middleware = require("./utils/middleware")
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost:27017/Trello', { useNewUrlParser: true })
    .then(() => {
        console.log('Connected Successfully')
        app.use(express.json())
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            )
            res.setHeader(
                'Access-Control-Allow-Methods',
                'GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH'
            )
            next()

        })
    })
    .catch((er) => {
        console.error('error connecting to MongoDB', er.message)
    })

app.use(cors())

// app.use(middleware.requestLogger)
// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)

app.use('/api/boards', boardsRouter)
app.use('/api/tables', tablesRouter)
app.use('/api/tasks', tasksRouter)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


module.exports = app
