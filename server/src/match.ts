import { Team } from "./team"
import { createGame, getGameStatus } from "./game-server"

export class Match {
    public teams: Team[]
    public results: Team[]
    private gameId: number

    constructor() {
        this.teams = []
    }

    public startGame() {
        const urls = this.teams.map(t => {
            return t.snakeUrl
        })
        createGame(urls, n => {
            this.gameId = n
        })
    }

    public status() {
        if (!this.gameId) {
            return
        }

        getGameStatus(this.gameId, json => {
            console.log(json)
        })
    }
}