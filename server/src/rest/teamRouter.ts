import express = require('express')
import { Router } from 'express'
import { ensureAuthenticated } from '../passport-auth'
import { updateUser, findUserByUserName, getTeamMembers, IUser } from '../db/users'
import { updateTeam, getTeam, ITeam } from '../db/teams'
import * as _ from 'lodash'

export const router = Router()

// Get
router.get('/', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  const user: IUser = req.user
  const teamId = user.teamId
  if (!teamId) {
    throw new Error('not on a team')
  }
  const team: ITeam = await getTeam(teamId)
  if (!team) {
    throw new Error('team not created')
  }
  res.json(team)
})

// Update
router.post('/', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  const user: IUser = req.user
  const teamId = user.teamId
  if (!teamId) {
    throw new Error('not on a team')
  }

  const newTeam = await updateTeam({
    captainId: teamId,
    teamName: req.body.teamName,
    snakeUrl: req.body.snakeUrl,
  })
  res.json(newTeam)
})

// List members
router.get('/members', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  const user: IUser = req.user
  const teamId = user.teamId
  if (!teamId) {
    throw new Error('not on a team')
  }
  
  // Get a list of team members for this users team
  const members = await getTeamMembers(teamId)
  res.json(members)
})

// Info about the team captain
router.get('/captain',ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  const user: IUser = req.user
  if (!user.teamId) {
    throw new Error('You are not on a team')
  }
  const capt = await findUserByUserName(user.teamId)
  res.json(capt)
})

// Team captains can add users
router.post('/add-user', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  // Post body : github userid
  // find or create user
  // See if user has a team already. If yes: error, if no add to team (conditional expression?)
  // Also: Max # of users on team (prevent adding limitless users)
})

// Team Captains can remove users
router.post('/remove-user', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  // Post body : github userid  
  // find user (no user, just exit)
  // Remove 'teamMember' param from user (but only if it equals _this_ users team id - prevent booting other users from other teams)
})
