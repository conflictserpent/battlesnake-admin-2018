import { v4 } from 'uuid'

import { IMatch, createMatch, getGameWinner, getMatchWinners } from './match'
import { getDocumentClient } from './client'
import { ITeam } from './teams';
import config from '../config'

export const optimalMatchSize = 8

const dynamoTable = "tournaments"

interface IRound {
  number: number,
  matches: IMatch[]
}

export interface ITournament {
  id: string,
  rounds: IRound[],
  teams: ITeam[],
  division: string,
  gameIndex?: number,
  gameServerId?: number,
  activeMatch?: IMatch
}

export function createTournament(teams: ITeam[], division: string) {
  const obj: ITournament = {
    id: v4(),
    rounds: [],
    teams: teams,
    division: division
  }
  initializeTournament(obj)
  return obj
}

export function initializeTournament(tournament: ITournament) {
  createMatches(tournament)
}

export function saveTournament(tournament: ITournament) {
  console.log(`saving tournament: ${tournament.id}`)
  const dc = getDocumentClient()

  const params = {
    TableName: dynamoTable,
    Item: tournament,
  }

  return dc.put(params).promise()
}

export async function loadTournament(id: string) {
  const dc = getDocumentClient()

  const input = {
    TableName: dynamoTable,
    Key: {
      id: id,
    },
  }

  const resp = await dc.get(input).promise()

  const t: ITournament = resp.Item as ITournament
  console.log("loaded tournament")

  return t
}

function createMatches(tournament: ITournament) {
  const teams = tournament.teams

  tournament.rounds.push(createRound(teams, tournament.rounds.length + 1))
}

function createRound(teams: ITeam[], roundNumber: number): IRound {
  let i = 0
  let size = 0
  const length = teams.length
  let chunks = Math.ceil(length / optimalMatchSize)

  const round: IRound = {
    number: roundNumber,
    matches: []
  }

  if (length % chunks === 0) {
    size = Math.floor(length / chunks)
    while (i < length) {
      const m = addMatch(teams.slice(i, (i += size)))
      round.matches.push(m)
    }
  } else {
    while (i < length) {
      size = Math.ceil((length - i) / chunks--)
      const m = addMatch(teams.slice(i, (i += size)))
      round.matches.push(m)
    }
  }

  return round
}

export function findMatch(tournament: ITournament, matchId: string): IMatch {
  let m = null
  for (const round of tournament.rounds) {
    m = round.matches.find(match => match.matchId === matchId)
    if (m) {
      break
    }
  }
  return m
}

export async function startNextRound(tournament: ITournament) {
  const lastRound = tournament.rounds[tournament.rounds.length - 1]
  const winners: ITeam[] = []
  const list = (await Promise.all(lastRound.matches.map(m => getMatchWinners(m, config.BATTLESNAKE_TOURNAMENT_SERVER_HOST))))
  list.forEach(i => i.forEach(t => winners.push(t)))

  const round = createRound(winners, tournament.rounds.length + 1)
  tournament.rounds.push(round)
  await saveTournament(tournament)
}

function addMatch(teams: ITeam[]) {
  const m = createMatch()
  m.teams = teams
  return m
}
