import React, { Component } from 'react'
import { Container, Table, Form, Segment, Header, Grid } from 'semantic-ui-react'

import axios from 'axios'
import config from '../config'

class Snakes extends Component {
  state = {
    snakes: [],
    selected: [],
    height: 20,
    width: 20,
    food: 5,
    gameId: null,
    teamId: null,
    snakeUrl: null
  }

  componentDidMount = () => {
    this.loadSnakes()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.teamMgr.loading && !nextProps.teamMgr.loading) {
      this.setState({
        teamId: nextProps.teamMgr.team.captainId,
        snakeUrl: nextProps.teamMgr.team.snakeUrl
      })
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async() => {
    const { selected, width, height, food, teamId } = this.state
    const resp = await axios(`${config.SERVER}/api/team/${teamId}/start-game`, {
      method: 'post',
      withCredentials: true,
      data: {
        width,
        height,
        food,
        snakes: selected
      }
    })
    this.setState({ gameId: resp.data.gameId })
    window.open(`${config.GAME_SERVER}/${resp.data.gameId}`)
  }

  loadSnakes = async() => {
    const resp = await axios(`${config.SERVER}/api/snakes/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    })
    this.setState({ snakes: resp.data })
  }

  selectSnake = (snake) => {
    let { selected } = this.state
    if (selected.indexOf(snake) === -1) {
      selected.push(snake)
    } else {
      selected = selected.filter(s => s !== snake)
    }
    this.setState({ selected })
  }

  render() {
    const { snakes, height, width, food, gameId, snakeUrl } = this.state
    const loading = this.props.teamMgr.loading
    const split = Math.ceil(snakes.length / 2)
    const first = snakes.slice(0, split)
    const second = snakes.slice(split)
    return (
      <Container>
        {!snakeUrl && <Segment inverted>
          <Header as='h4' inverted color='red'>Warning: Team snake url needs to be set before creating a game.</Header>
        </Segment>}
        <Table celled inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell />
              <Table.HeaderCell />
              <Table.HeaderCell>Name</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {first.map((s, i) => {
              return (
                <Table.Row key={s.name}>
                  <Table.Cell textAlign="center">
                    <Form.Checkbox onChange={() => this.selectSnake(s)} />
                  </Table.Cell>
                  <Table.Cell>{s.name}</Table.Cell>
                  <Table.Cell />
                  <Table.Cell textAlign="center">
                    {(i < second.length) && <Form.Checkbox onChange={() => this.selectSnake(second[i])} />}
                  </Table.Cell>
                  <Table.Cell>
                    {(i < second.length) && second[i].name}
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='5'>
                <Grid centered padded>
                  <Form inverted onSubmit={this.handleSubmit} loading={loading}>
                    <Form.Group>
                      <Form.Input
                        label="Board Width"
                        placeholder="Board Width"
                        name="width"
                        value={width}
                        onChange={this.handleChange}
                        error={
                          this.state.error &&
                          this.state.error.field === 'width'
                        }
                      />
                      <Form.Input
                        label="Board Height"
                        placeholder="Board Height"
                        name="height"
                        value={height}
                        onChange={this.handleChange}
                        error={
                          this.state.error &&
                          this.state.error.field === 'height'
                        }
                      />
                      <Form.Input
                        label="Food"
                        placeholder="Food"
                        name="food"
                        value={food}
                        onChange={this.handleChange}
                        error={
                          this.state.error &&
                          this.state.error.field === 'food'
                        }
                      />
                    </Form.Group>

                    {snakeUrl && <Form.Button content="Create Game" />}
                    {gameId && <a style={{ color: 'white' }} href={`${config.GAME_SERVER}/${gameId}`} target="_blank">View Game</a>}
                  </Form>
                </Grid>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Container>
    )
  }
}

export default Snakes
