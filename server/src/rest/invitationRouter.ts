import express = require('express')
import { ensureAuthenticated } from '../passport-auth'
import { putUser, IUser } from '../db/users'
import { addInvitation, getInvitation } from '../db/invitations'
import * as _ from 'lodash'

export const router = express.Router()

router.get('/', ensureAuthenticated, (req: express.Request, res: express.Response) => {
  res.json({ oh: 'my' })
})

router.post(
  '/',
  ensureAuthenticated,
  async (req: express.Request, res: express.Response) => {
    const resp = await addInvitation('one', 'one')
    res.json(resp)
  }
)

router.post(
  '/accept',
  ensureAuthenticated,
  async (req: express.Request, res: express.Response, next) => {
    const teamId = req.body.teamId
    if (!teamId) {
      throw new Error ('invalid args')
    }
    
    const user: IUser = req.user
    // See if this user has an invitation
    const invitation = await getInvitation(user.id, teamId)
    // TODO: if (!invitation)

    // TODO: add user to team :)
    res.json({msg: 'ok'})
  }
)
