import express = require('express')
import passportGithub = require('passport-github')
import passport = require('passport')
import session = require('express-session')
import RedisStore = require('connect-redis')
import { ensureAuthenticated } from './passport-auth'

const Store = RedisStore(session);

const redisHost = process.env.REDIS_HOST || 'localhost'

console.log(`=> Connecting to redis at ${redisHost}`)

// Need to setup sessions
const app = express()
app.use(session({
  secret: 'fi5e', store: new Store({
    host: redisHost,
    port: '6379'
  })
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/auth/github', passport.authenticate('github'))

app.get('/', (req, res) => {
  res.send('Hello World!' + process.env.GITHUB_CLIENT_ID)

})

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/protected')
})

app.get('/protected', ensureAuthenticated, (req, res) => {
  res.send('Congrats, sessions work')
})

export default app
