import { Router } from 'express'
import { company } from 'faker'
import { promisify } from 'util'

import { ITournament, createTournament, loadTournament, saveTournament } from '../db/tournament'
import { getDocumentClient } from '../db/client'
import { startGame, getMatchWinners } from '../db/match'
import { ITeam } from '../db/teams';
import { v4 } from 'uuid'
import { getGameStatus } from '../game-server';

export const router = express.Router()

const snakeUrls = ['http://35.230.120.237', 'https://dsnek.herokuapp.com']

router.get('/', async (req, res) => {
  const dc = getDocumentClient()
  const asyncScan = promisify(dc.scan.bind(dc))
  const input = {
    TableName: 'tournaments',
  }
  const resp = await asyncScan(input)
  res.render('tournaments.html', {
    tournaments: await Promise.all(resp.Items.map(async t => {
      return {
        id: t.id,
        matches: await Promise.all(t.matches.map(async m => {
          const winners = await getMatchWinners(m)
          return {
            ...m,
            winners: winners.map(w => w.teamName)
          }
        }))
      }
    })),
    gameServerUrl: process.env.BATTLESNAKE_SERVER_HOST,
  })
})

router.get('/match-status', async (req, res) => {
  if (!req.query.matchId || !req.query.id) {
    res.redirect('/tournaments')
    return
  }

  const id = req.query.id
  const matchId = req.query.matchId

  const t = await loadTournament(req.query.id)
  const m = t.matches.find(match => match.matchId == matchId)
  if (m == null || !m.gameId) {
    res.redirect('/tournaments')
    return
  }

  const json = await getGameStatus(m.gameId)
  res.send(json)
})

router.get('/extra', async (req, res) => {
  const id = req.query.id
  if (id) {
    const t = await loadTournament(id)
    res.render('test-tournament.html', {
      tournament: JSON.stringify(t),
    })
  } else {
    const teams = []
    for (let i = 0; i < 100; i++) {
      const team: ITeam = {
        id: v4(),
        snakeUrl: snakeUrls[Math.floor(Math.random() * snakeUrls.length)],
        teamName: company.companyName(),
        captainId: v4(),
      }
      teams.push(team)
    }
    const t = createTournament(teams)
    saveTournament(t)
    res.render('test-tournament.html', {
      tournament: JSON.stringify(t),
      id: t.id,
    })
  }
})

router.get('/delete', async (req, res) => {
  if (!req.query.id) {
    res.redirect('/tournaments')
    return
  }
  const dc = getDocumentClient()
  const asyncDelete = promisify(dc.delete.bind(dc))
  const input = {
    TableName: 'tournaments',
    Key: {
      id: req.query.id,
    },
  }
  await asyncDelete(input)
  res.redirect('/tournaments')
})

router.get('/start-match', async (req, res) => {
  if (!req.query.matchId || !req.query.id) {
    res.redirect('/tournaments')
    return
  }

  const t = await loadTournament(req.query.id)
  const m = t.matches.find(mm => mm.matchId === req.query.matchId)
  await startGame(m)
  await saveTournament(t)
  res.redirect('/tournaments')
})

router.get('/reset-matches', async (req, res) => {
  if (!req.query.id) {
    res.redirect('/tournaments')
    return
  }

  const t = await loadTournament(req.query.id)
  t.matches.forEach(m => (m.gameId = null))
  await saveTournament(t)
  res.redirect('/tournaments')
})
