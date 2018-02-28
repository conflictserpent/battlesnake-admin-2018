import { createTournament, optimalMatchSize } from '../db/tournament'
import { ITeam } from '../db/teams'

function runTest(numTeams: number, numMatches: number) {
  const teams: ITeam[] = []
  for (let i = 0; i < numTeams; i++) {
    teams.push({
      captainId: i.toString(),
      snakeUrl: '',
      teamName: '',
      division: '',
    })
  }
  const t = createTournament(teams, "Expert")
  expect(t.matches).toHaveLength(numMatches)

  const expectedSize = t.matches[0].teams.length
  for (const m of t.matches) {
    expect(m.teams.length).toBeGreaterThanOrEqual(expectedSize - 1)
    expect(m.teams.length).toBeLessThanOrEqual(expectedSize + 1)
  }
}

test('team count (5)', () => {
  runTest(5, 1)
})
test('team count (7)', () => {
  runTest(7, 1)
})
test('team count (8)', () => {
  runTest(8, 1)
})
test('team count (9)', () => {
  runTest(9, 2)
})
test('team count (10)', () => {
  runTest(10, 2)
})
test('team count (11)', () => {
  runTest(11, 2)
})
test('team count (12)', () => {
  runTest(12, 2)
})
test('team count (13)', () => {
  runTest(13, 2)
})
test('team count (14)', () => {
  runTest(14, 2)
})
test('team count (15)', () => {
  runTest(15, 2)
})
test('team count (16)', () => {
  runTest(16, 2)
})
test('team count (17)', () => {
  runTest(17, 3)
})
test('team count (64)', () => {
  runTest(64, 8)
})
test('team count (65)', () => {
  runTest(65, 9)
})
