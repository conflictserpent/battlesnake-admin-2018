import passportGithub = require('passport-github')
import passport = require('passport')

const GitHubStrategy = (passportGithub as any).Strategy

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `http://${process.env.HOST}/auth/github/callback`,
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile)
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
