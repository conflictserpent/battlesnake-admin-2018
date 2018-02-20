import express = require('express')
import { Router } from 'express'
import { ensureAuthenticated } from '../passport-auth'
import { updateUser, findUserById, IUser } from '../db/users'
import { updateTeam, ITeam } from '../db/teams'
import * as _ from 'lodash'

export const router = Router()

router.get('/', ensureAuthenticated, (req: express.Request, res: express.Response) => {
  res.json(req.user)
})

router.post(
  '/captain-on',
  ensureAuthenticated,
  async (req: express.Request, res: express.Response) => {
    const user: IUser = await findUserById(req.user.username)
    
    if (user.teamMember) {
      throw new Error('Already a team member - must remove self from team')
    }
    
    const captainId = user.id

    user.isTeamCaptain = true
    user.team = captainId

    const team: ITeam = {
      captainId: captainId,
      teamName: null,
      snakeUrl: null,
    }

    await updateTeam(team)
    await updateUser(user)

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
    await updateUser(user)
    res.json(user)
  }
)
