import request = require('request')
import _ = require('lodash')
import { ITeam } from './db/teams';
import { promisify } from 'util';

export const SERVER_HOST = process.env.BATTLESNAKE_SERVER_HOST

// this is what needs to be configured the day of the tournament
const DefaultGameConfig: IGameConfig = {
    width: 20,
    height: 20,
    maxFood: 10,
    snakeStartLength: 3,
    decHealthPoints: 1,
    snakes: []
}

export async function createGame(teams: ITeam[]) {
    return createGameWithConfig({
        ...DefaultGameConfig,
        snakes: teams.map(t => {
            return {
                name: t.teamName,
                url: t.snakeUrl
            }
        })
    })
}

interface IGameConfig {
    width: number,
    height: number,
    maxFood: number,
    snakeStartLength: number,
    decHealthPoints: number,
    snakes: ISnakeConfig[]
}

export interface ISnakeConfig {
    name: string,
    url: string
}

export async function createGameWithConfig({ width, height, maxFood, snakeStartLength, decHealthPoints, snakes }: IGameConfig) {
    const formData = {
        "game_form[width]": width || 20,
        "game_form[height]": height || 20,
        "game_form[delay]": 10,
        "game_form[recv_timeout]": 200, // this is the line to configure game latency, day of the tournament
        "game_form[max_food]": maxFood || 10,
        "game_form[snake_start_length]": snakeStartLength || 3,
        "game_form[dec_health_points]": decHealthPoints || 1
    }
    snakes.forEach((snake, idx) => {
        const urlKey = `game_form[snakes][${idx}][url]`
        const nameKey = `game_form[snakes][${idx}][name]`
        const deleteKey = `game_form[snakes][${idx}][delete]`

        formData[urlKey] = snake.url
        formData[nameKey] = snake.name
        formData[deleteKey] = 'false'
    });
    const post = promisify(request.post)
    const res = await post({ url: process.env.BATTLESNAKE_SERVER_HOST, formData: formData })
    const gameId = _.get(res.headers.location.split('/'), 1)
    return gameId
}

export interface IGameStatus {
    status: string
    board: IBoard
}

interface IBoard {
    snakes: ISnake[]
    deadSnakes: IDeadSnake[]
}

interface ISnake {
    name: string
}
interface IDeadSnake {
    name: string
    death: IDeath
}
interface IDeath {
    turn: number
}

export async function getGameStatus(gameId: number): Promise<IGameStatus> {
    const get = promisify(request.get)
    const res = await get({ url: `${process.env.BATTLESNAKE_SERVER_HOST}/status/${gameId}` })
    return JSON.parse(res.body)
}
