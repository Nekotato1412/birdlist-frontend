require('dotenv').config()

const PORT = process.env.PORT
const API_URL = process.env.API_URL

const CORS = require('cors')
const winston = require('winston')
const bcrypt = require('bcrypt')

const Fetch = require('node-fetch')

const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.cli(),
    transports: [new winston.transports.Console()]
})
const Express = require('express')
const { json } = require('express')
const { loggers } = require('winston')
const App = Express()

App.use(CORS())
App.use(Express.urlencoded({ extended: false }))

App.set('view-engine', 'ejs')

App.get('/login', (req, res) => {
    res.render('login.ejs')
})

App.get("/", (req, res) => {
    res.redirect("/login")
})


App.listen(PORT, async () => {
    Logger.info(`Listening on port ${PORT}`)
    try {
        const request = await Fetch(`${API_URL}/status`)
        const requestBody = await request.text()
        const status = JSON.parse(requestBody)
        if (status.online) {
            Logger.info('Connected to API')
        } else {
            Logger.warn('API Maintainence.')
        }
    } catch {
        Logger.error('Could not connect to API.')
    }
})