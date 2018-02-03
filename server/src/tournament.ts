import { Team } from "./team"
import { Match } from "./match"

const optimalMatchSize = 8

export class Tournament {
    public matches: Match[]
    private teams: Team[]

    constructor(teams: Team[]) {
        this.teams = teams
        this.matches = []
    }

    public initialize() {
        let m = new Match()
        for (const t of this.teams) {
            m.teams.push(t)
            if (m.teams.length >= optimalMatchSize) {
                this.matches.push(m)
                m = new Match()
            }
        }
    }
}

export function createTournament(teams: Team[]): Tournament {
    const t = new Tournament(teams)
    t.initialize()
    return t
}