import passportGithub = require('passport-github')
import passport = require('passport')
import config from './config'
import { putUser, findUserById, IUser} from './db/users'

const GitHubStrategy = (passportGithub as any).Strategy

const strategyOpts = {
  clientID: config.GITHUB_CLIENT_ID,
  clientSecret: config.GITHUB_CLIENT_SECRET,
  callbackURL: config.GITHUB_CALLBACK_URL,
}

const strategyCallback = async (accessToken, refreshToken, profile, cb) => {
  // Try to put the profile in there
  // TODO: assert id is valid
  console.log(profile)
  const user = {
    id: profile.id,
    displayName: profile.displayName,
    userName: profile.userName,
    isTeamCaptain: false,
  }
  await putUser(user)
  cb(null, user)
}

passport.use(new GitHubStrategy(strategyOpts, strategyCallback))

passport.serializeUser((user: IUser, done) => {
  console.log('serializeUser', user.id)
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  // id has to match the same type as `serialize user`. Casting is ok
  const user = await findUserById(id as string)
  console.log('Deserialized this:', user)
  done(null, user)
})

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
