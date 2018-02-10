import { Team } from "./team"
import { Match } from "./match"

export const optimalMatchSize = 8

export class Tournament {
    public matches: Match[]
    private teams: Team[]

    constructor(teams: Team[]) {
        this.teams = teams
        this.matches = []
    }

    public initialize() {
        this.createMatches(this.teams)
    }

    private createMatches(teams: Team[]) {
        const length = teams.length
        let i = 0
        let size = 0;
        let chunks = Math.ceil(length / optimalMatchSize)

        if (length % chunks === 0) {
            size = Math.floor(length / chunks);
            while (i < length) {
                this.addMatch(teams.slice(i, i += size))
            }
        }
        else {
            while (i < length) {
                size = Math.ceil((length - i) / chunks--);
                this.addMatch(teams.slice(i, i += size));
            }
        }
    }

    private addMatch(teams: Team[]) {
        const m = new Match()
        m.teams = teams
        this.matches.push(m)
    }
}

export function createTournament(teams: Team[]): Tournament {
    const t = new Tournament(teams)
    t.initialize()
    return t
}