const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-Parser')
const mongoose = require('mongoose')
const router = require('./routes/authRoutes')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/api-auth')

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())

router.initRouter(app)

const port = process.env.PORT || 3000
app.listen(port)
console.log(`server listening at port ${port}`)
