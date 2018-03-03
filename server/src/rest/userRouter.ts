import express = require('express')
import { Router } from 'express'
import { ensureAuthenticated } from '../passport-auth'
import { updateUser, findUserByUserName, setTeamCaptain, IUser } from '../db/users'
import { updateTeam, ITeam } from '../db/teams'
import * as _ from 'lodash'

export const router = Router()

router.get('/', ensureAuthenticated, (req: express.Request, res: express.Response) => {
  res.set({ csrfToken: (req as any).csrfToken(), 'Access-Control-Expose-Headers': 'csrfToken' }).json(req.user)
})

router.get('/logout', (req: express.Request, res: express.Response) => {
  req.logout()
  res.send({})
})

router.post(
  '/captain-on',
  ensureAuthenticated,
  async (req: express.Request, res: express.Response) => {
    const user: IUser = req.user as IUser
    if (user.teamId) {
      throw new Error('Already a team member - must remove self from team')
    }

    user.isTeamCaptain = true
    user.teamId = user.username
    const team: ITeam = {
      captainId: user.username,
      teamName: null,
      snakeUrl: null,
      division: null,
    }

    await updateTeam(team)
    const result = await setTeamCaptain(user, true)
    res.json(result)
  }
)

router.post(
  '/captain-off',
  ensureAuthenticated,
  async (req: express.Request, res: express.Response) => {
    // TODO:  Pre-req: Make sure the captains team is empty (?)
    const user: IUser = _.cloneDeep(req.user as IUser)
    const result = await setTeamCaptain(user, false)
    res.json(result)
  }
)
