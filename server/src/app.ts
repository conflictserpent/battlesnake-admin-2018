import express = require('express')
import passportGithub = require('passport-github')
import passport = require('passport')
import session = require('express-session')
import RedisStore = require('connect-redis')
import AWS = require('aws-sdk')

import { ensureAuthenticated } from './passport-auth'
import config from './config'

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

app.get('/', (req, res) => {
  const inst = new AWS.DynamoDB({
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  })
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

app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('Congrats, sessions work')
})

export default app
