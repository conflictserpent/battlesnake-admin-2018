import passportGithub = require('passport-github')
import passport = require('passport')

const GitHubStrategy = (passportGithub as any).Strategy

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      console.log('strategy callback')
      cb(null, profile)
    }
  )
)

passport.serializeUser((user, done) => {
  console.log('serialize user')
  done(null, user)
})

passport.deserializeUser((user, done) => {
  console.log('deserialize user')
  done(null, user)
})

export function ensureAuthenticated(req, res, next) {
  console.log('ensure authenticated')
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
