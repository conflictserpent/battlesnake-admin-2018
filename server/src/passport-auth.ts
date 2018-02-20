import passportGithub = require('passport-github')
import passport = require('passport')
import config from './config'
import { updateUser, findUserById, IUser } from './db/users'

const GitHubStrategy = (passportGithub as any).Strategy

const strategyOpts = {
  clientID: config.GITHUB_CLIENT_ID,
  clientSecret: config.GITHUB_CLIENT_SECRET,
  callbackURL: config.GITHUB_CALLBACK_URL,
}

const strategyCallback = async (accessToken, refreshToken, profile, cb) => {
  const user = {
    id: profile.id,
    username: profile.username,
    displayName: profile.displayName,
  }
  await updateUser(user as IUser)
  cb(null, user)
}

passport.use(new GitHubStrategy(strategyOpts, strategyCallback))

passport.serializeUser((user: IUser, done) => {
  done(null, user.username)
})

passport.deserializeUser(async (id, done) => {
  // id has to match the same type as `serialize user`. Casting is ok
  const user = await findUserById(id as string)
  done(null, user)
})

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
