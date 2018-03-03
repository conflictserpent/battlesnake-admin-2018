import { createGame, getGameStatus, IGameStatus } from "../game-server"
import { v4 } from 'uuid'
import { ITeam } from "./teams";
import config from '../config'

export interface IMatch {
    teams: ITeam[]
    results: ITeam[]
    matchId: string
    gameIds: number[]
}

export function createMatch(): IMatch {
    return {
        teams: [],
        results: [],
        matchId: v4(),
        gameIds: [],
    }
}

export async function startGame(match: IMatch, division: string) {
    console.log("start game")
    const winners = (await getMatchWinners(match, config.BATTLESNAKE_TOURNAMENT_SERVER_HOST)).filter(w => w !== null)
    console.log("winners:", winners)
    const winnerIds = winners.map(w => w.captainId)
    if (!match.gameIds) {
        match.gameIds = []
    }
    const game = await createGame(match.teams.filter(m => winnerIds.indexOf(m.captainId) === -1), config.BATTLESNAKE_TOURNAMENT_SERVER_HOST, division)
    match.gameIds.push(game)
}

export async function matchStatus(match: IMatch, serverHost: string): Promise<IGameStatus[]> {
    if (match.gameIds.length === 0) {
        return
    }

    return Promise.all(match.gameIds.map(id => getGameStatus(id, serverHost)))
}

export async function getMatchWinners(match: IMatch, serverHost: string): Promise<ITeam[]> {
    return Promise.all((match.gameIds || []).map(id => getGameWinner(match, id, serverHost)))
}

export async function getGameWinner(match: IMatch, gameId: number, serverHost: string): Promise<ITeam> {
    const json = await getGameStatus(gameId, serverHost)

    if (!json || json.status !== "halted") {
        return null
    }

    if (json.board.snakes.length > 0) {
        return findSnake(match, json.board.snakes[0].name)
    }

    json.board.deadSnakes.sort((a, b) => {
        if (a.death.turn > b.death.turn) {
            return -1
        } else if (a.death.turn < b.death.turn) {
            return 1
        }
        // TODO: Use snake length if more then one snake is in 2nd place?
        return 0
    })

    return findSnake(match, json.board.deadSnakes[0].name)
}

function findSnake(match: IMatch, name: string): ITeam {
    return match.teams.find(t => t.teamName === name)
}