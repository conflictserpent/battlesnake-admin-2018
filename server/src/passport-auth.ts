import passportGithub = require('passport-github')
import passport = require('passport')
import config from './config'
import { updateUser, findUserByUserName, IUser } from './db/users'

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
  console.log(user)
  await updateUser(user as IUser)
  cb(null, user)
}

passport.use(new GitHubStrategy(strategyOpts, strategyCallback))

passport.serializeUser((user: IUser, done) => {
  done(null, user.username)
})

passport.deserializeUser(async (id, done) => {
  // id has to match the same type as `serialize user`. Casting is ok
  const user = await findUserByUserName(id as string)
  done(null, user)
})

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.send(401, { err: 'missing authorization' })
}

export function authorizeAdmin(req, res, next) {
  const user: IUser = req.user as IUser
  if (!user.admin) {
    res.send(403, { err: 'unauthorized' })
    return
  }
  next()
}
