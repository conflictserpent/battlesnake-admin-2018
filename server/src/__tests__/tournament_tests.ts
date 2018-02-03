import { createTournament } from "../tournament"
import { Team } from "../team"

test("setup matches", () => {
    const teams: Team[] = []
    for (let i = 0; i < 64; i++) {
        teams.push(new Team(i.toString()))
    }
    expect(teams).toHaveLength(64)
    const t = createTournament(teams)
    expect(t.matches).toHaveLength(8)
})