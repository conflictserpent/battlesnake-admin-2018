import { createGame, getGameStatus, IGameStatus } from "../game-server"
import { v4 } from 'uuid'
import { ITeam } from "./teams";

export interface IMatch {
    teams: ITeam[]
    results: ITeam[]
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

export async function startGame(match: IMatch) {
    match.gameId = await createGame(match.teams)
}

export function gameUrl(match: IMatch) {
    return `${process.env.BATTLESNAKE_SERVER_HOST}/${match.gameId}`
}

export async function matchStatus(match: IMatch): Promise<IGameStatus> {
    if (!match.gameId) {
        return
    }

    return await getGameStatus(match.gameId)
}

export async function getMatchWinners(match: IMatch): Promise<ITeam[]> {
    const json = await matchStatus(match)
    const winners: ITeam[] = []

    if (!json || json.status != "halted") {
        return winners
    }

    console.log(json)
    if (json.board.snakes.length > 0) {
        winners.push(findSnake(match, json.board.snakes[0].name))
    }

    const numToTake = 2 - winners.length

    json.board.deadSnakes.sort((a, b) => {
        if (a.death.turn > b.death.turn) {
            return -1
        } else if (a.death.turn < b.death.turn) {
            return 1
        }
        // TODO: Use snake length if more then one snake is in 2nd place?
        return 0
    })

    const additional = json.board.deadSnakes.slice(0, numToTake).map(s => findSnake(match, s.name))
    winners.push(...additional)

    return winners
}

function findSnake(match: IMatch, name: string): ITeam {
    return match.teams.find(t => t.teamName == name)
}