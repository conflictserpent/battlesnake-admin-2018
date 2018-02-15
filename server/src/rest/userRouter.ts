import express = require('express')
import { ensureAuthenticated } from '../passport-auth'
import { putUser, IUser } from '../db/users'
import { updateTeam, ITeam} from '../db/teams'
import { addInvitation, getInvitation } from '../db/invitations'
import * as _ from 'lodash'

export const router = express.Router()

router.get('/', ensureAuthenticated, (req: express.Request, res: express.Response) => {
  res.json(req.user)
})

router.post(
  '/captain-on',
  ensureAuthenticated,
  async (req: express.Request, res: express.Response) => {
    // TODO:  Pre-req: Make sure user isn't on a team already
    const user: IUser = _.cloneDeep(req.user)
    const captainId = user.id
    
    user.isTeamCaptain = true
    user.team = captainId
    
    const team: ITeam = {
      captainId: captainId,
      teamName: '',
      snakeUrl: '',
    }
    await updateTeam(team)
    await putUser(user)
    res.json(user)
  }
)

router.post(
  '/captain-off',
  ensureAuthenticated,
  async (req: express.Request, res: express.Response) => {
    // TODO:  Pre-req: Make sure the captains team is empty (?)
    const user: IUser = _.cloneDeep(req.user)
    user.isTeamCaptain = false
    await putUser(user)
    res.json(user)
  }
)
