import { Router } from 'express'
import { company } from 'faker'

import { ITournament, createTournament, loadTournament, saveTournament, findMatch, startNextRound } from '../db/tournament'
import { getDocumentClient } from '../db/client'
import { startGame, getMatchWinners } from '../db/match'
import { ITeam, getTeams } from '../db/teams';
import { v4 } from 'uuid'
import { ensureAuthenticated, authorizeAdmin } from '../passport-auth'
import { createGameWithConfig, IGameConfig, SERVER_HOST, getGameStatus } from '../game-server'
import config from '../config'

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
        activeGame: t.gameIndex,
        activeMatch: t.activeMatch,
        gameServerId: t.gameServerId,
        matches: await Promise.all(t.rounds.map(r => r.matches.map(async m => {
          const winners = (await getMatchWinners(m, config.BATTLESNAKE_TOURNAMENT_SERVER_HOST)).filter(w => w !== null)
          return {
            ...m,
            winners: (winners || []).map(w => w.teamName)
          }
        })))
      }
    })),
    // gameServerUrl: process.env.BATTLESNAKE_SERVER_HOST,
  })
})

router.get("/:id", ensureAuthenticated, authorizeAdmin, async (req, res) => {
  const t = await loadTournament(req.params.id)
  res.send(t)
})

router.post('/:id/start-next-round', ensureAuthenticated, authorizeAdmin, async (req, res) => {
  const t = await loadTournament(req.params.id)
  await startNextRound(t)
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
  const m = findMatch(t, matchId)
  if (m == null || (m.gameIds || []).length === 0) {
    res.send(m || {})
    return
  }

  const winners = (await getMatchWinners(m, config.BATTLESNAKE_TOURNAMENT_SERVER_HOST)).filter(w => w !== null)
  res.send({
    ...m,
    winners
  })
})

router.post('/create', ensureAuthenticated, authorizeAdmin, async (req, res) => {

  const tournaments = []
  const divisions = ['expert', 'intermediate', 'beginner']
  for (const division of divisions) {
    console.log(division)
    const teams = (await getTeams()).filter(team => team.division === division)
    const t = createTournament(teams, division)
    saveTournament(t)
    tournaments.push(t)
  }

  res.send(tournaments)
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
  const m = findMatch(t, req.params.matchId)
  await startGame(m, t.division)
  await saveTournament(t)
  res.send(m)
})

router.post('/:id/match/:matchId/set-active', ensureAuthenticated, authorizeAdmin, async (req, res) => {
  if (!req.params.matchId || !req.params.id) {
    res.send({})
    return
  }

  const t = await loadTournament(req.params.id)
  const m = findMatch(t, req.params.matchId)
  t.gameIndex = req.body.gameIndex
  t.gameServerId = req.body.gameServerId
  t.activeMatch = m
  await saveTournament(t)
  res.send(m)
})

router.get('/reset-matches', ensureAuthenticated, authorizeAdmin, async (req, res) => {
  if (!req.query.id) {
    res.redirect('/tournaments')
    return
  }

  const t = await loadTournament(req.query.id)
  t.rounds.forEach(r => r.matches.forEach(m => (m.gameIds = [])))
  await saveTournament(t)
  res.redirect('/tournaments')
})
