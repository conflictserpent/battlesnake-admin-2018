import { Router } from 'express'
import { company } from 'faker'

import { ITournament, createTournament, loadTournament, saveTournament } from '../db/tournament'
import { getDocumentClient } from '../db/client'
import { startGame, getMatchWinners } from '../db/match'
import { ITeam } from '../db/teams';
import { v4 } from 'uuid'
import { getGameStatus } from '../game-server';
import { ensureAuthenticated, authorizeAdmin } from '../passport-auth'
import { createGameWithConfig, IGameConfig, SERVER_HOST } from '../game-server'

export const router = Router()

const snakeUrls = ['http://35.230.120.237', 'https://dsnek.herokuapp.com']


router.post('/start', ensureAuthenticated, (req, res) => {
  const body: IGameConfig = req.body
  console.log('body', body)
  createGameWithConfig(body)
    .then(gameId => {
      res.send({ gameUrl: `${SERVER_HOST}/${gameId}` })
    })
    .catch(error => {
      console.log('error', error)
      res.status(500)
      res.send({ error })
    })
})

router.get('/', ensureAuthenticated, authorizeAdmin, async (req, res) => {
  const dc = getDocumentClient()
  const input = {
    TableName: 'tournaments',
  }
  const resp = await dc.scan(input).promise()
  res.send({
    tournaments: await Promise.all(resp.Items.map(async t => {

      return {
        id: t.id,
        division: t.division,
        matches: await Promise.all(t.matches.map(async m => {
          const winners = (await getMatchWinners(m)).filter(w => w !== null)
          return {
            ...m,
            winners: (winners || []).map(w => w.teamName)
          }
        }))
      }
    })),
    // gameServerUrl: process.env.BATTLESNAKE_SERVER_HOST,
  })
})

router.get("/:id", ensureAuthenticated, authorizeAdmin, async (req, res) => {
  const t = await loadTournament(req.params.id)
  res.send(t)
})

router.get('/:id/match/:matchId', authorizeAdmin, async (req, res) => {
  if (!req.params.matchId || !req.params.id) {
    res.send({})
    return
  }

  const id = req.params.id
  const matchId = req.params.matchId

  const t = await loadTournament(id)
  const m = t.matches.find(match => match.matchId === matchId)
  if (m == null || (m.gameIds || []).length === 0) {
    res.send({})
    return
  }

  const winners = (await getMatchWinners(m)).filter(w => w !== null)
  res.send({
    ...m,
    winners
  })
})

router.get('/extra', ensureAuthenticated, authorizeAdmin, async (req, res) => {
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
        snakeUrl: snakeUrls[Math.floor(Math.random() * snakeUrls.length)],
        teamName: company.companyName(),
        captainId: v4(),
        division: 'Expert'
      }
      teams.push(team)
    }
    const t = createTournament(teams, 'Expert')
    saveTournament(t)
    res.render('test-tournament.html', {
      tournament: JSON.stringify(t),
      id: t.id,
    })
  }
})

router.post('/create', ensureAuthenticated, authorizeAdmin, async (req, res) => {
  const teams = []
  for (let i = 0; i < 100; i++) {
    const team: ITeam = {
      snakeUrl: snakeUrls[Math.floor(Math.random() * snakeUrls.length)],
      teamName: company.companyName(),
      captainId: v4(),
      division: 'Expert'
    }
    teams.push(team)
  }
  const t = createTournament(teams, 'Expert')
  saveTournament(t)
  res.send(JSON.stringify(t))
})

router.post('/delete', ensureAuthenticated, authorizeAdmin, async (req, res) => {
  if (!req.body.id) {
    res.send({})
  }
  const dc = getDocumentClient()
  const input = {
    TableName: 'tournaments',
    Key: {
      id: req.body.id,
    },
  }
  await dc.delete(input).promise()
  res.send({})
})

router.get('/:id/match/:matchId/run-game', ensureAuthenticated, authorizeAdmin, async (req, res) => {
  if (!req.params.matchId || !req.params.id) {
    res.send({})
    return
  }

  const t = await loadTournament(req.params.id)
  const m = t.matches.find(mm => mm.matchId === req.params.matchId)
  await startGame(m)
  await saveTournament(t)
  res.send(m)
})

router.get('/reset-matches', ensureAuthenticated, authorizeAdmin, async (req, res) => {
  if (!req.query.id) {
    res.redirect('/tournaments')
    return
  }

  const t = await loadTournament(req.query.id)
  t.matches.forEach(m => (m.gameIds = []))
  await saveTournament(t)
  res.redirect('/tournaments')
})
