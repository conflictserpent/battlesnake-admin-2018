import express = require('express')
import { Router } from 'express'
import { ensureAuthenticated, authorizeAdmin } from '../passport-auth'
import {
  updateUser,
  findUserByUserName,
  getTeamMembers,
  setTeamMembership,
  addUnknownUserToTeam,
  IUser,
  removeTeamMembership,
} from '../db/users'
import { updateTeam, getTeam, ITeam } from '../db/teams'
import { createGameWithConfig, ISnakeConfig, SERVER_HOST } from '../game-server'
import config from '../config'
import * as _ from 'lodash'

export const router = Router()

// Get
router.get('/', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  const user: IUser = req.user as IUser
  const teamId = user.teamId
  if (!teamId) {
    res.status(500).send('not on a team')
    throw new Error('not on a team') // need to do something about this, otherwise, you get 30s requests
  }
  const team: ITeam = await getTeam(teamId)
  if (!team) {
    throw new Error('team not created')
  }
  res.json(team)
})

router.get('/can-edit', ensureAuthenticated, (req: express.Request, res: express.Response) => {
  res.json({ can_edit: config.ALLOW_TEAM_EDIT })
})

router.post('/admin-create', authorizeAdmin, ensureAuthenticated, async (req: express.Request, res: express.Response) => {

  const user = {
    id: req.body.user.id,
    username: req.body.user.username,
    displayName: req.body.user.displayName,
    isTeamCaptain: true,
    teamId: req.body.user.username,
    admin: false
  }
  const newUser = await updateUser(user as IUser)

  const team = {
    captainId: user.username,
    teamName: req.body.teamName,
    snakeUrl: req.body.snakeUrl,
    division: req.body.division,
    description: req.body.description
  }
  const newTeam = await updateTeam(team)
  res.json(newTeam)
})

// Create
router.post('/', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  const user: IUser = req.user as IUser
  const teamId = user.teamId
  if (teamId) {
    res.status(500).send('already on a team')
    throw new Error('already on a team')
  }

  const newTeam = await updateTeam({
    captainId: teamId,
    teamName: req.body.teamName,
    snakeUrl: req.body.snakeUrl,
    division: null
  })
  res.json(newTeam)
})

// Update
router.post('/update', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  if (!config.ALLOW_TEAM_EDIT) {
    res.json({ error: "unable to edit teams" })
    return
  }

  const user: IUser = req.user as IUser
  const teamId = user.teamId
  if (!teamId) {
    throw new Error('not on a team')
  }

  const updatedTeam = await updateTeam({
    captainId: teamId,
    teamName: req.body.teamName,
    snakeUrl: req.body.snakeUrl,
    division: req.body.division,
    description: req.body.description
  })
  res.json(updatedTeam)
})

// List members
router.get('/members', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  const user: IUser = req.user as IUser
  const teamId = user.teamId
  if (!teamId) {
    throw new Error('not on a team')
  }

  // Get a list of team members for this users team
  const members = await getTeamMembers(teamId)
  res.json(members)
})

router.post('/:teamId/start-game', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  const teamId = req.params.teamId

  let team: ITeam = null
  try {
    team = await getTeam(teamId)
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({ error })
    return
  }

  const snakes: ISnakeConfig[] = req.body.snakes
  snakes.push({
    name: team.teamName,
    url: team.snakeUrl
  })

  let gameId: number
  try {
    gameId = await createGameWithConfig({
      width: req.body.width,
      height: req.body.height,
      maxFood: req.body.food,
      snakeStartLength: 3,
      decHealthPoints: 1,
      pinTail: false,
      snakes: snakes,
    })
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({ error })
    return
  }

  res.json({ gameId, gameUrl: `${SERVER_HOST}/${gameId}` })
})

// Get team info
router.get('/:teamId/snake', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  const teamId = req.params.teamId

  let team: ITeam = null
  try {
    team = await getTeam(teamId)
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({ error })
    return
  }

  if (!team) {
    res.status(400)
    res.json({ error: 'could not find team' })
    return
  }

  res.json({ team })
})

// Info about the team captain
router.get('/captain', ensureAuthenticated, async (req: express.Request, res: express.Response) => {
  const user: IUser = req.user as IUser
  if (!user.teamId) {
    throw new Error('You are not on a team')
  }
  const capt = await findUserByUserName(user.teamId)
  res.json(capt)
})

// Team captains can add users
router.post(
  '/add-user',
  ensureAuthenticated,
  async (req: express.Request, res: express.Response) => {
    // validation
    if (!req.user.teamId) {
      return res.status(400).json({ msg: 'you are not on a team' })
    }
    if (!req.body.username) {
      return res.status(400).json({ msg: 'missing parameter' })
    }
    const userName = req.body.username.toLowerCase()

    const user = await findUserByUserName(userName)
    if (!user) {
      // Its ok to invite users who haven't signed in yet
      const newUser = addUnknownUserToTeam(userName, req.user.teamId)
      return res.json({ status: 'ok' })
    }

    // Don't add user to another team
    if (user.teamId) {
      return res.status(400).json({ msg: 'user already in a team' })
    }

    setTeamMembership(userName, req.user.teamId)
    return res.json({ status: 'ok' })
  }
)

// Team Captains can remove users
router.post(
  '/remove-user',
  ensureAuthenticated,
  async (req: express.Request, res: express.Response) => {
    // Post body : github userid
    // find user (no user, just exit)
    // Remove 'teamMember' param from user (but only if it equals _this_ users team id - prevent booting other users from other teams)
    // validation
    if (!req.user.teamId) {
      return res.status(400).json({ msg: 'you are not on a team' })
    }
    if (!req.body.username) {
      return res.status(400).json({ msg: 'missing parameter' })
    }

    const userName = req.body.username.toLowerCase()
    const removeUser = await findUserByUserName(userName)
    if (removeUser === undefined) {
      return res.status(400).json({ msg: 'the user does not exist' })
    }

    // Don't allow removing el capitan!
    if (removeUser.teamId === removeUser.username) {
      return res.status(400).json({ msg: 'captains cannot be removed' })
    }

    // Don't allow removing user from another team
    if (removeUser.teamId !== req.user.teamId) {
      return res.status(400).json({ msg: 'users are not on the same team - you can only manage users from your own team' })
    }

    removeTeamMembership(removeUser.username)
    return res.json({ status: 'ok' })
  }
)
