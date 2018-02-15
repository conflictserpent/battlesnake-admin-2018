import express = require('express')
import passportGithub = require('passport-github')
import passport = require('passport')
import session = require('express-session')
import RedisStore = require('connect-redis')

import { ensureAuthenticated } from './passport-auth'
import config from './config'
import nunjucks = require('nunjucks')
import bodyParser = require('body-parser')
import { createGame, getGameStatus } from './game-server'
import request = require('request')
import { userRouter, invitationRouter } from './rest'
import { router as tournyRouter } from './routes/tournament'

const Store = RedisStore(session)

// Setup Passport to set sessions in redis
const app = express()
app.use(
  session({
    secret: 'fi5e',
    store: new Store({
      host: config.REDIS_HOST,
      port: '6379',
    }),
    resave: true,
    saveUninitialized: false,
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use('/self', userRouter)
app.use('/invitations', invitationRouter)
app.use('/tournaments', tournyRouter)

nunjucks.configure('views', {
  autoescape: true,
  express: app,
})

app.get('/', (req, res) => {
  res.send('Hello World!!!')
})

app.get('/auth/github', passport.authenticate('github'))

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/protected')
  }
)

app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('Congrats, sessions work ' + req.user.id)
})

// GAME TESTING STUFF
app.get('/start-game', (req, res) => {
  const teams = []
  const urls = ['https://dsnek.herokuapp.com', 'https://dsnek.herokuapp.com']
  urls.forEach(url => {
    teams.push({
      snakeUrl: url,
      name: 'a team',
    })
  })
  createGame(teams, id => {
    res.send(id)
  })
})

app.post('/game-status', (req, res) => {
  getGameStatus(req.body.gameId, json => {
    res.render('test-tournament.html', {
      data: json,
    })
  })
})

export default app
