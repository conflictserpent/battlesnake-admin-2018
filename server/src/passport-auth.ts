import passportGithub = require('passport-github')
import passport = require('passport')
import config from './config'
import { putUser } from './db/users'

const GitHubStrategy = (passportGithub as any).Strategy

const strategyOpts = {
  clientID: config.GITHUB_CLIENT_ID,
  clientSecret: config.GITHUB_CLIENT_SECRET,
  callbackURL: config.GITHUB_CALLBACK_URL,
}

const strategyCallback = async (accessToken, refreshToken, profile, cb) => {
  // Try to put the profile in there
  // Todo: assert id is valid
  const persisted = await putUser({
    id: profile.id,
    displayName: profile.displayName,
    userName: profile.userName,
  })
  console.log(persisted)
  cb(null, persisted)
}

passport.use(new GitHubStrategy(strategyOpts, strategyCallback))

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
