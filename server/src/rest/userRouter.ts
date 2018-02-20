import express = require('express')
import { Router } from 'express'
import { ensureAuthenticated } from '../passport-auth'
import { updateUser, findUserByUserName, IUser } from '../db/users'
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
    const user: IUser = req.user
    if (user.teamId) {
      throw new Error('Already a team member - must remove self from team')
    }
    
    user.isTeamCaptain = true
    user.teamId = user.username
    const team: ITeam = {
      captainId: user.username,
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
    user.teamId = null
    await updateUser(user)
    res.json(user)
  }
)

router.post(
  '/leave-team',
  ensureAuthenticated,
  async (req: express.Request, res: express.Response) => {
    // If user is a team member; remove self from team, save, finish
    // else: error
  }
)
