import { Express } from 'express'
import { company } from 'faker'
import { promisify } from 'util'

import { Tournament } from '../db/tournament'
import { Team } from "../team"
import { getDocumentClient } from '../db/client'
import { startGame } from '../match'

const snakeUrls = ['http://35.230.120.237', 'https://dsnek.herokuapp.com']

export function createRoutes(app: Express) {
    app.get('/tournaments', async (req, res) => {
        const dc = getDocumentClient()
        const asyncScan = promisify(dc.scan.bind(dc))
        const input = {
            TableName: 'tournaments',
        }
        let resp = await asyncScan(input)
        res.render('tournaments.html', {
            tournaments: resp.Items,
            gameServerUrl: process.env.BATTLESNAKE_SERVER_HOST
        })
    })

    app.get('/tournament', async (req, res) => {
        let id = req.query.id
        if (id) {
            let t = new Tournament([])
            await t.load(id)
            res.render('test-tournament.html', {
                tournament: JSON.stringify(t),
            })
        } else {
            let teams = []
            for (let i = 0; i < 100; i++) {
                let team = new Team(i.toString())
                team.snakeUrl = snakeUrls[Math.floor(Math.random() * snakeUrls.length)]
                team.teamName = company.companyName()
                teams.push(team)
            }
            let t = new Tournament(teams)
            t.initialize()
            t.save()
            res.render('test-tournament.html', {
                tournament: JSON.stringify(t),
                id: t.id
            })
        }
    })

    app.get('/delete-tournament', async (req, res) => {
        if (!req.query.id) {
            res.redirect('/tournaments')
            return
        }
        const dc = getDocumentClient()
        const asyncDelete = promisify(dc.delete.bind(dc))
        const input = {
            TableName: 'tournaments',
            Key: {
                id: req.query.id
            }
        }
        await asyncDelete(input)
        res.redirect('/tournaments')
    })

    app.get('/start-match', async (req, res) => {
        if (!req.query.matchId || !req.query.id) {
            res.redirect('/tournaments')
            return
        }

        let t = new Tournament([])
        await t.load(req.query.id)
        let m = t.matches.find(m => m.matchId == req.query.matchId)
        console.log(m)
        startGame(m, async () => {
            await t.save()
            res.redirect('/tournaments')
        })
    })

    app.get('/reset-matches', async (req, res) => {
        if (!req.query.id) {
            res.redirect('/tournaments')
            return
        }

        let t = new Tournament([])
        await t.load(req.query.id)
        t.matches.forEach(m => m.gameId = null)
        await t.save()
        res.redirect('/tournaments')
    })
}