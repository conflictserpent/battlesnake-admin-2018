import { promisify } from 'util'
import { v4 } from 'uuid'

import { IMatch, createMatch } from '../match'
import { Team } from '../team'
import { getDocumentClient } from '../db/client'

export const optimalMatchSize = 8

export class Tournament {
  public matches: IMatch[]
  public id: string

  private teams: Team[]
  private table: string

  constructor(teams: Team[]) {
    this.teams = teams
    this.matches = []
    this.table = 'tournaments'
    this.id = v4()
  }

  public initialize() {
    this.createMatches(this.teams)
  }

  public save() {
    console.log(`saving tournament: ${this.id}`)
    const dc = getDocumentClient()
    const asyncPut = promisify(dc.put.bind(dc))

    const params = {
      TableName: this.table,
      Item: {
        id: this.id,
        matches: this.matches,
      },
    }

    return asyncPut(params)
  }

  public async load(id: string) {
    const dc = getDocumentClient()
    const asyncGet = promisify(dc.get.bind(dc))

    const input = {
      TableName: this.table,
      Key: {
        id: id,
      },
    }

    const resp = await asyncGet(input)
    if (!resp.Item.matches) {
      return
    }

    this.id = resp.Item.id
    this.matches = resp.Item.matches
    for (const m of this.matches) {
      for (const t of m.teams) {
        this.teams.push(t)
      }
    }
  }

  private createMatches(teams: Team[]) {
    const length = teams.length
    let i = 0
    let size = 0
    let chunks = Math.ceil(length / optimalMatchSize)

    if (length % chunks === 0) {
      size = Math.floor(length / chunks)
      while (i < length) {
        this.addMatch(teams.slice(i, (i += size)))
      }
    } else {
      while (i < length) {
        size = Math.ceil((length - i) / chunks--)
        this.addMatch(teams.slice(i, (i += size)))
      }
    }
  }

  private addMatch(teams: Team[]) {
    const m = createMatch()
    m.teams = teams
    this.matches.push(m)
  }
}

export function createTournament(teams: Team[]): Tournament {
  const t = new Tournament(teams)
  t.initialize()
  return t
}
