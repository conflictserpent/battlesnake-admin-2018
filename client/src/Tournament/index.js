import React, { Component } from 'react'
import { Grid, Container, Button, Item, Table, Divider, Segment, Label, Card, Tab } from 'semantic-ui-react'
import { Route, NavLink } from 'react-router-dom'
import { NavButton } from '../components/NavButton'

import axios from 'axios'
import config from '../config'

class Tournaments extends Component {
  render() {
    return (
      <Grid container>
        <Container>
          <Route exact path="/tournament" component={TournamentList} />
          <Route exact path="/tournament/:id" component={TournamentInfo} />
          <Route path="/tournament/:id/match/:matchId" component={TournamentMatchInfo} />
        </Container>
      </Grid>
    )
  }
}

export class TournamentActiveGame extends Component {
  state = {
    activeGame: null
  }

  componentDidMount = async() => {
    await this.loadTournament()
  }

  loadTournament = async() => {
    const { match } = this.props
    const resp = await axios(`${config.SERVER}/api/tournaments/${match.params.id}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })
    this.setState({
      gameId: resp.data.gameServerId
    })
  }

  render() {
    const {gameId} = this.state
    return (
      <iframe
        src={`${config.TOURNAMENT_GAME_SERVER}/${gameId}`}
        style={{width: '100vw', height: '100vh'}}
        title="game-view"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    )
  }
}

class TournamentMatchInfo extends Component {
  state = {
    match: null
  }

  componentDidMount = async() => {
    await this.loadMatch()
  }

  loadMatch = async() => {
    const { match } = this.props
    const resp = await axios(`${config.SERVER}/api/tournaments/${match.params.id}/match/${match.params.matchId}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })
    this.setState({match: resp.data})
  }

  nextHeat = async() => {
    const { match } = this.props

    await axios(`${config.SERVER}/api/tournaments/${match.params.id}/match/${match.params.matchId}/run-game`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })
    this.loadMatch()
  }

  render() {
    const { match } = this.state
    return (
      <div>
        { !match && <div>Loading...</div>}
        { match &&
          <div>
            <Item>
              <NavButton
                floated="right"
                newPath={'/tournament/' + this.props.match.params.id}
                text="Back" />
              <Button
                floated="right"
                type="button"
                onClick={this.loadMatch}>Refresh</Button>
              <Button
                floated="right"
                type="button"
                onClick={this.nextHeat}>Next Heat</Button>
            </Item>
            <h1>Match</h1>
            <Divider />
            <Grid container>
              <Grid.Column width={8}>
                <label>Id:</label>
                <span> {match.matchId}</span><br/>
                <Segment.Group>
                  <Segment>
                    <Label attached="top">Games</Label>
                    <div>
                      {(match.gameIds || []).map(g => {
                        return (
                          <span>
                            <a key={g} href={`${config.TOURNAMENT_GAME_SERVER}/${g}`} target="_blank"># {match.gameIds.indexOf(g) + 1}</a>&nbsp;&nbsp;&nbsp;
                          </span>
                        )
                      })}
                    </div>
                  </Segment>
                  <Segment>
                    <Label attached="top">Winners</Label>
                    {(match.winners || []).map(w => {
                      return (
                        <div key={w.captainId}>
                          {w.teamName}
                        </div>
                      )
                    })}
                  </Segment>
                </Segment.Group>
              </Grid.Column>
              <Grid.Column width={8}>
                {match.teams.map(t => {
                  return (
                    <Card fluid key={t.captainId}>
                      <Card.Content header={t.teamName} />
                      <Card.Content description={t.description} />
                    </Card>
                  )
                })}
              </Grid.Column>
            </Grid>
          </div>
        }
      </div>
    )
  }
}

class TournamentInfo extends Component {
  state = {
    tournament: null,
    activeMatch: {},
    activeGame: null
  }

  componentDidMount = async() => {
    await this.loadTournament()
  }

  loadTournament = async() => {
    const { match } = this.props
    const resp = await axios(`${config.SERVER}/api/tournaments/${match.params.id}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })
    this.setState({
      tournament: resp.data,
      activeGame: resp.data.gameIndex,
      activeMatch: resp.data.activeMatch || {}
    })
  }

  checkMatchStatus = async(matchId) => {
    const { tournament } = this.state
    if (!tournament) {
      return
    }

    await axios(`${config.SERVER}/api/tournaments/${tournament.id}/match/${matchId}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })
  }

  setActiveGame = async(match, game, number) => {
    const { tournament } = this.state
    await axios(`${config.SERVER}/api/tournaments/${tournament.id}/match/${match.matchId}/set-active`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true,
      data: {
        gameServerId: game,
        gameIndex: number
      }
    })
    this.setState({activeMatch: match, activeGame: number})
  }

  startGame = async(matchId) => {
    const { tournament } = this.state
    if (!tournament) {
      return
    }

    await axios(`${config.SERVER}/api/tournaments/${tournament.id}/match/${matchId}/run-game`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })

    this.loadTournament()
  }

  getTabPanes = (tournament) => {
    const panes = tournament.rounds.map(r => {
      return {
        menuItem: `Round #${r.number}`,
        render: () => <Tab.Pane attached={false}>{this.getRoundTable(tournament, r)}</Tab.Pane>
      }
    })
    return panes
  }

  getRoundTable = (tournament, round) => {
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Match ID</Table.HeaderCell>
            <Table.HeaderCell># of Teams</Table.HeaderCell>
            <Table.HeaderCell>Rounds</Table.HeaderCell>
            <Table.HeaderCell/>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {round.matches.map(m => {
            return (
              <Table.Row key={m.matchId}>
                <Table.Cell>
                  <NavLink to={`/tournament/${tournament.id}/match/${m.matchId}`}>{m.matchId}</NavLink>
                </Table.Cell>
                <Table.Cell>
                  {m.teams.length}
                </Table.Cell>
                <Table.Cell>
                  {(m.gameIds || []).map(g => {
                    return (
                      <div key={g}>
                        <a style={{paddingRight: '10px'}} key={g} href={`${config.TOURNAMENT_GAME_SERVER}/${g}`} target="_blank">Game # {m.gameIds.indexOf(g) + 1}</a>
                        <a href="#top" onClick={() => { this.setActiveGame(m, g, m.gameIds.indexOf(g) + 1) }}>Set Active</a>
                      </div>
                    )
                  })}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    primary
                    size="mini"
                    type="button"
                    onClick={() => this.startGame(m.matchId)}>
                             Next Heat
                  </Button>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }

  startNextRound = async() => {
    const { tournament } = this.state
    if (!tournament) {
      return
    }

    await axios(`${config.SERVER}/api/tournaments/${tournament.id}/start-next-round`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })

    this.loadTournament()
  }

  render() {
    const { tournament, activeMatch, activeGame } = this.state
    return (
      <div id="top">
        { !tournament && <div>Loading...</div>}
        { tournament &&
        <div>
          <Item>
            <NavButton
              floated="right"
              newPath={'/tournament/'}
              text="Back" />
            <Button
              floated="right"
              type="button"
              onClick={this.loadTournament}>Refresh</Button>
            <Button
              floated="right"
              type="button"
              onClick={this.startNextRound}>Next Round</Button>
            {activeMatch && activeGame &&
            <div>
              Current Match: {activeMatch.matchId}&nbsp;&nbsp;&nbsp;
              Current Game: {activeGame}&nbsp;&nbsp;&nbsp;
              <NavLink to={`/tournament/${tournament.id}/active-game`} target="_blank">View</NavLink>
            </div>}
          </Item>
          <h1>{ tournament.division }</h1>
          <Tab menu={{ secondary: true, pointing: true }} panes={this.getTabPanes(tournament)} />

        </div>}
      </div>
    )
  }
}

class TournamentList extends Component {
  state = {
    tournaments: [] // load existing tournaments here
  }

  createTournaments = async() => {
    const resp = await axios(`${config.SERVER}/api/tournaments/create`, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })
    this.setState((state) => {
      const t = state.tournaments
      for (const tournament of resp.data) {
        t.push(tournament)
      }

      return {tournaments: t}
    })
  }

  componentDidMount = async() => {
    const resp = await axios(`${config.SERVER}/api/tournaments/`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })
    this.setState({tournaments: resp.data.tournaments})
  }

  deleteTournament = async(id) => {
    await axios(`${config.SERVER}/api/tournaments/delete/`, {
      method: 'POST',
      data: {
        id
      },
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })
    this.setState((state) => {
      const t = state.tournaments.filter(t => t.id !== id)
      return {tournaments: t}
    })
  }
  render() {
    return (
      <div>
        <h1>Tournaments</h1>
        <Button onClick={this.createTournaments}>Create Tournaments</Button>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Division</Table.HeaderCell>
              <Table.HeaderCell/>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.tournaments.map(t => {
              return (
                <Table.Row key={t.id}>
                  <Table.Cell>
                    {t.division}
                  </Table.Cell>
                  <Table.Cell>
                    <NavButton size='mini' newPath={'/tournament/' + t.id} text="View" />
                    <Button
                      size="mini"
                      color="red"
                      type="button"
                      onClick={() => this.deleteTournament(t.id)}>
                           Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default Tournaments
