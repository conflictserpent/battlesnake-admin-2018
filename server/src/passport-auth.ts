import passportGithub = require('passport-github')
import passport = require('passport')
import config from './config'

const GitHubStrategy = (passportGithub as any).Strategy

passport.use(
  new GitHubStrategy(
    {
      clientID: config.GITHUB_CLIENT_ID,
      clientSecret: config.GITHUB_CLIENT_SECRET,
      callbackURL: `${config.GITHUB_CALLBACK_URL}/auth/github/callback`,
    },
    (accessToken, refreshToken, profile, cb) => {
      cb(null, profile)
    }
  )
)

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
