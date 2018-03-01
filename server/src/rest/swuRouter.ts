import express = require('express')
import { Router } from 'express'
import { ensureAuthenticated, authorizeAdmin } from '../passport-auth'
// import { updateUser, findUserByUserName, setTeamCaptain, IUser } from '../db/users'
import { getTeams } from '../db/teams'
import * as _ from 'lodash'

export const router = Router()

router.get('/teams', ensureAuthenticated, authorizeAdmin, async (req: express.Request, res: express.Response) => {
    const teams = await getTeams()
    teams.sort((a, b) => {
        if (a.teamName > b.teamName) {
            return -1
        } else if (a.teamName < b.teamName) {
            return 1
        }
        // TODO: Use snake length if more then one snake is in 2nd place?
        return 0
    })
    res.send(teams)
})
