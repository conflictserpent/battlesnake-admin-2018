import { promisify } from 'util'
import { v4 } from 'uuid'

import { IMatch, createMatch } from './match'
import { getDocumentClient } from './client'
import { ITeam } from './teams';

export const optimalMatchSize = 8

const dynamoTable = "tournaments"

export interface ITournament {
  id: string,
  matches: IMatch[],
  teams: ITeam[],
}

export function createTournament(teams: ITeam[]) {
  const obj: ITournament = {
    id: v4(),
    matches: [],
    teams: teams,
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
  const asyncPut = promisify(dc.put.bind(dc))

  const params = {
    TableName: dynamoTable,
    Item: {
      id: tournament.id,
      matches: tournament.matches,
    },
  }

  return asyncPut(params)
}

export async function loadTournament(id: string) {
  const dc = getDocumentClient()
  const asyncGet = promisify(dc.get.bind(dc))

  const input = {
    TableName: dynamoTable,
    Key: {
      id: id,
    },
  }

  const resp = await asyncGet(input)
  if (!resp.Item.matches) {
    return
  }

  const teams: ITeam[] = []

  let t: ITournament = {
    id: resp.Item.id,
    matches: resp.Item.matches,
    teams: teams,
  }

  for (const m of t.matches) {
    for (const team of m.teams) {
      t.teams.push(team)
    }
  }
  console.log("loaded tournament")

  return t
}

function createMatches(tournament: ITournament) {
  const teams = tournament.teams
  const length = teams.length
  let i = 0
  let size = 0
  let chunks = Math.ceil(length / optimalMatchSize)

  if (length % chunks === 0) {
    size = Math.floor(length / chunks)
    while (i < length) {
      const m = addMatch(teams.slice(i, (i += size)))
      tournament.matches.push(m)
    }
  } else {
    while (i < length) {
      size = Math.ceil((length - i) / chunks--)
      const m = addMatch(teams.slice(i, (i += size)))
      tournament.matches.push(m)
    }
  }
}

function addMatch(teams: ITeam[]) {
  const m = createMatch()
  m.teams = teams
  return m
}
