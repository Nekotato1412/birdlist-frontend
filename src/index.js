require('dotenv').config()

const PORT = process.env.PORT
const API_URL = process.env.API_URL

const CORS = require('cors')
const winston = require('winston')
const passport = require('passport')
const { configPassport } = require('./passportConfig,js')
const { fromAPI } = require('./util.js')

const Logger = winston.createLogger({
    level: 'info',
    format: winston.format.cli(),
    transports: [new winston.transports.Console()]
})
const Express = require('express')
const { application } = require('express')
const flash = require('express-flash')
const session = require('express-session')
const { loggers } = require('winston')

const App = Express()
configPassport(passport)

App.use(CORS())
App.use(Express.urlencoded({ extended: false }))
App.use(flash())
App.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
App.use(passport.initialize())
App.use(passport.session())

App.set('view-engine', 'ejs')

App.get('/login', (req, res) => {
    res.render('login.ejs')
})

App.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

App.get("/", (req, res) => {
    res.redirect("/login")
})


App.listen(PORT, async () => {
    Logger.info(`Listening on port ${PORT}`)
        const status = await fromAPI('/status')
        if (!status) {
            Logger.error("Could not connect to API")
        } else if (status.online) {
            Logger.info("Connected to API")
        } else {
            Logger.warn("API Maintainence")
        }
})