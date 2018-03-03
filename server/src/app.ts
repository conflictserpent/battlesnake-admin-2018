import express = require('express')
import passportGithub = require('passport-github')
import passport = require('passport')
import session = require('express-session')
import RedisStore = require('connect-redis')
import github = require('octonode')
import bodyParser = require('body-parser')
import csurf = require('csurf')

import { ensureAuthenticated } from './passport-auth'
import config from './config'
import { createGame, getGameStatus } from './game-server'
import request = require('request')
import { userRouter, teamRouter, tournamentRouter, swuRouter, snakesRouter } from './rest'
import { ITeam } from './db/teams'

const Store = RedisStore(session)
const csrfProtection = csurf()

// Setup Passport to set sessions in redis
const app = express()
app.use(
  session({
    secret: config.SESSION_SECRET,
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
app.use(csrfProtection)

app.use('/api/self', userRouter)
app.use('/api/team', teamRouter)
app.use('/api/tournaments', tournamentRouter)
app.use('/api/swu', swuRouter)
app.use('/api/snakes', snakesRouter)

app.post('/api/github-username', (req: express.Request, res: express.Response) => {
  const client = github.client(config.GITHUB_OAUTH_TOKEN)
  const ghme = client.user(req.body.username)
  ghme.info((err, data, headers) => {
    res.send(data)
  })
})

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
      division: '',
    })
  })
  createGame(teams, null, '')
})

app.post('/game-status', (req, res) => {
  const json = getGameStatus(req.body.gameId, process.env.BATTLESNAKE_SERVER_HOST)
  res.render('test-tournament.html', {
    data: json,
  })
})

app.get('*', (req, res) => {
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
