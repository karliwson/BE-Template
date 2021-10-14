const express = require('express')
const { getProfile } = require('./middlewares')
const router = require('./router')

const app = express()

app.use(express.json())
app.use(getProfile)
app.use(router)

module.exports = app
