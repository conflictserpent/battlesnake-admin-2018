import { Team } from "./team"
import { createGame, getGameStatus } from "./game-server"

import { v4 } from 'uuid'

export interface IMatch {
    teams: Team[]
    results: Team[]
    matchId: string
    gameId: number
}

export function createMatch(): IMatch {
    return {
        teams: [],
        results: [],
        matchId: v4(),
        gameId: null,
    }
}

export function startGame(match: IMatch, cb: () => void) {
    createGame(match.teams, n => {
        match.gameId = n
        cb()
    })
}

export function gameUrl(match: IMatch) {
    return `${process.env.BATTLESNAKE_SERVER_HOST}/${match.gameId}`
}

export function matchStatus(match: IMatch, cb: () => void) {
    if (!match.gameId) {
        return
    }

    getGameStatus(match.gameId, json => {
        console.log(json)
        cb()
    })
}