import request = require('request')
import _ = require('lodash')
import { ITeam } from './db/teams';
import { promisify } from 'util';

export const SERVER_HOST = process.env.BATTLESNAKE_SERVER_HOST

export async function createGame(teams: ITeam[]) {
    const formData = {
        "game_form[width]": 20,
        "game_form[height]": 20,
        "game_form[delay]": 10,
        "game_form[recv_timeout]": 200,
        "game_form[max_food]": 10,
        "game_form[snake_start_length]": 3,
        "game_form[dec_health_points]": 1,
        "game_form[game_mode]": "multiplayer"
    }
    let count = 0
    teams.forEach(element => {
        const urlKey = `game_form[snakes][${count}][url]`
        formData[urlKey] = element.snakeUrl
        const nameKey = `game_form[snakes][${count}][name]`
        formData[nameKey] = element.teamName
        count++
    });
    const post = promisify(request.post)
    const res = await post({ url: process.env.BATTLESNAKE_SERVER_HOST, formData: formData })
    const gameId = _.get(res.headers.location.split('/'), 1)
    return gameId
}

export async function createGameWithConfig({ width, height, maxFood, snakeStartLength, decHealthPoints, snakes }) {
  const formData = {
      "game_form[width]": width || 20,
      "game_form[height]": height || 20,
      "game_form[delay]": 10,
      "game_form[recv_timeout]": 200,
      "game_form[max_food]": maxFood || 10,
      "game_form[snake_start_length]": snakeStartLength || 3,
      "game_form[dec_health_points]": decHealthPoints || 1,
      "game_form[game_mode]": "multiplayer"
  }
  Object.keys(snakes).forEach((key, idx) => {
      const urlKey = `game_form[snakes][${idx}][url]`
      const nameKey = `game_form[snakes][${idx}][name]`
      const deleteKey = `game_form[snakes][${idx}][delete]`

      formData[urlKey] = 'http://35.185.235.22'
      formData[nameKey] = key
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
