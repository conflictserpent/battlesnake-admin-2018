import express = require('express')
import passportGithub = require('passport-github')
import passport = require('passport')
import session = require('express-session')
import RedisStore = require('connect-redis')

import { ensureAuthenticated } from './passport-auth'
import config from './config'
import bodyParser = require('body-parser')
import { createGame, getGameStatus } from './game-server'
import request = require('request')
import { userRouter, teamRouter, tournyRouter } from './rest'
import { ITeam } from './db/teams'

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
    cookie: {
      domain: config.COOKIE_DOMAIN,
    },
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


app.use('/api/self', userRouter)
app.use('/api/team', teamRouter)
app.use('/api/tournaments', tournyRouter)

// Init login flow
app.get('/auth/github', passport.authenticate('github'))

// Sets up session; redirect to app
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(config.AUTH_REDIRECT_URL)
  }
)

// GAME TESTING STUFF
app.get('/start-game', (req, res) => {
  const teams: ITeam[] = []
  const urls = ['https://dsnek.herokuapp.com', 'https://dsnek.herokuapp.com']
  urls.forEach(url => {
    teams.push({
      snakeUrl: url,
      teamName: 'a team',
      captainId: '',
    })
  })
  createGame(teams)
})

app.post('/game-status', (req, res) => {
  const json = getGameStatus(req.body.gameId)
  res.render('test-tournament.html', {
    data: json,
  })
})

app.get('/', (req, res) => {
  request(config.HOMEPAGE, (err, _, body) => {
    if (err) {
      res.status(500)
      console.log('fetching index failed', err)
      return
    }
    res.send(body)
  })
})

export default app
