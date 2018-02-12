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
import { Tournament } from './tournament';
import { Team } from './team';

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
app.use(bodyParser.urlencoded({
  extended: true
}));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/auth/github', passport.authenticate('github'))

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/protected')
  }
)

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/protected')
})

app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('Congrats, sessions work ' + req.user.id)
})


// GAME TESTING STUFF
app.get('/start-game', (req, res) => {
  createGame(['https://dsnek.herokuapp.com', 'https://dsnek.herokuapp.com'], id => {
    res.send(id)
  })
})

app.get('/test-tournament', async (req, res) => {
  let id = req.query.id
  if (id) {
    let t = new Tournament([])
    await t.load(id)
    res.render('test-tournament.html', {
      tournament: JSON.stringify(t),
    })
  } else {
    let teams = []
    for (let i = 0; i < 100; i++) {
      teams.push(new Team(i.toString()))
    }
    let t = new Tournament(teams)
    t.initialize()
    t.save()
    res.render('test-tournament.html', {
      tournament: JSON.stringify(t),
      id: t.id
    })
  }
})

app.post('/game-status', (req, res) => {
  getGameStatus(req.body.gameId, (json) => {
    res.render('test-tournament.html', {
      data: json
    })
  })
})

export default app
