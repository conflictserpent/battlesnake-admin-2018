import * as React from 'react'
import { userProvider } from '../components/data'
import { Form, Message, Header, Segment } from 'semantic-ui-react'
import axios from 'axios'
import config from '../config'

class Bounty extends React.Component {
  state = {}

  handleFieldChange = (name, ev) => {
    this.setState({
      [name]: ev.target.value
    })
  }

  handleStartGame = (ev) => {
    axios(`${config.SERVER}/api/team/${this.state.teamName}/start-bounty-game`, {
      method: 'post',
      withCredentials: true
    }).then(res => {
      this.setState({
        gameUrl: res.data.gameUrl,
        error: null
      })
    }).catch(error => {
      this.setState({ error: error.message })
    })
  }

  render() {
    const { loading, user } = this.props.userMgr
    const config = user.bountyCollector

    if (!user.bountyCollector) {
      return <h1>Not A Bounty Collector</h1>
    }

    return (
      <div>
        <h1>Bounty</h1>
        {loading &&
          <p>Loading...</p>
        }
        {!loading && config &&
          <BountyGame />
        }
      </div>
    )
  }
}

class BountyGame extends React.Component {
  state = {
    bountySnakes: [],
    challengerSnakes: [],
    snakeCount: 1
  }

  handlePinTail = () => {
    this.setState(state => {
      return {
        'pinTail': !state.pinTail
      }
    })
  }

  handleFieldChange = (name, ev) => {
    this.setState({
      [name]: ev.target.value
    })
  }

  handleUpdateSnake = (name, idx, ev) => {
    const snakes = this.state.bountySnakes.slice()
    snakes[idx] = ev.target.value
    this.setState({ bountySnakes: snakes })
  }

  handleIncrSnakes = () => {
    const snakes = this.state.bountySnakes.concat([''])
    this.setState({ bountySnakes: snakes })
  }

  handleSearchChallenger = () => {
    axios(`${config.SERVER}/api/team/${this.state.captainId}/snake`, {
      method: 'get',
      withCredentials: true
    }).then(res => {
      const challengerSnakes = []
      for (let i = 0; i < this.state.challengerCount; i++) {
        challengerSnakes.push(`${this.state.captainId}-${i + 1}@${res.data.team.snakeUrl}`)
      }
      this.setState({
        challengerSnakes: challengerSnakes,
        error: null
      })
    }).catch(error => {
      this.setState({ error: error.message })
    })
  }

  handleSearch = () => {
    this.setState({ bountySnakes: this.state.bountySnakes.concat(['']) })
  }

  handleStartGame = (ev) => {
    const body = JSON.parse(JSON.stringify(this.state))
    body.snakes = []

    body.bountySnakes.forEach((snake, i) => {
      const spl = snake.split('@')
      body.snakes.push({
        url: spl[1],
        name: spl[0]
      })
    })
    body.challengerSnakes.forEach((snake) => {
      const spl = snake.split('@')
      body.snakes.push({
        url: spl[1],
        name: spl[0]
      })
    })

    axios(`${config.SERVER}/api/tournaments/start`, {
      method: 'post',
      withCredentials: true,
      data: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      this.setState({ gameUrl: res.data.gameUrl })
    }).catch(error => {
      this.setState({ error: error.message })
    })
  }

  render() {
    const {
      width,
      height,
      decHealthPoints,
      captainId,
      bountySnakes,
      challengerCount,
      turnDelay,
      snakeStartLength,
      maxFood,
      pinTail,
      challengerSnakes,
      gameUrl
    } = this.state

    return (
      <Segment stacked padded='very'>
        <Form >
          <Header as="h3" >Game Setup</Header>
          <Form.Group widths={2}>
            <Form.Input
              placeholder='Game Width'
              label="Game Width"
              name='width'
              onChange={this.handleFieldChange.bind(this, 'width')}
              value={width || ''}
            />

            <Form.Input
              placeholder='Game Height'
              label="Game Height"
              name='height'
              onChange={this.handleFieldChange.bind(this, 'height')}
              value={height || ''}
            />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Input
              placeholder='Health Points per Turn'
              label="Health Points per Turn"
              name='decHealthPoints'
              onChange={this.handleFieldChange.bind(this, 'decHealthPoints')}
              value={decHealthPoints || ''}
            />

            <Form.Input
              placeholder='Turn Delay'
              label="Turn Delay"
              name='turnDelay'
              onChange={this.handleFieldChange.bind(this, 'turnDelay')}
              value={turnDelay || ''}
            />
          </Form.Group>
          <Form.Group widths={2}>

            <Form.Input
              label='Max Food'
              placeholder='Max Food'
              name='maxFood'
              onChange={this.handleFieldChange.bind(this, 'maxFood')}
              value={maxFood || ''}
            />

            <Form.Input
              label='Snake Start Length'
              placeholder='Snake Start Length'
              name='snakeStartLength'
              onChange={this.handleFieldChange.bind(this, 'snakeStartLength')}
              value={snakeStartLength || ''}
            />
          </Form.Group>
          <Form.Group widths={2}>
            <Form.Checkbox
              label='Pin Tail'
              placeholder='Pin Tail'
              name='pinTail'
              onChange={this.handlePinTail}
              checked={pinTail || false}
            />
          </Form.Group>
          <Header as="h3">{"Bounty Snake URL's"}</Header>
          <Message color="blue">
            Setup a bounty snake url using mysnakename@http://mysnakeurl.com
          </Message>
          {bountySnakes.map((snake, idx) =>
            <Form.Input
              key={idx}
              placeholder={`Bounty Snake ${idx + 1}`}
              name='bountySnake'
              onChange={this.handleUpdateSnake.bind(this, 'bountySnakes', idx)}
              value={bountySnakes[idx] || ''}
            />
          )}

          <Form.Button
            content="Add Snake"
            onClick={this.handleIncrSnakes}
          />

          <Header as="h3" >User Snakes</Header>
          <Form.Group widths={2}>
            <Form.Input
              label='Challenger Count'
              placeholder='Challenger Count'
              name='challengerCount'
              onChange={this.handleFieldChange.bind(this, 'challengerCount')}
              value={challengerCount || ''}
            />

            <Form.Input
              label='Team Captain GitHub Username'
              placeholder='Team Captain GitHub Username'
              name='captainId'
              onChange={this.handleFieldChange.bind(this, 'captainId')}
              value={captainId || ''}
            />
          </Form.Group>
          <Form.Group widths={2}>
            {challengerSnakes.map((snakeUrl, idx) =>
              <Form.Input
                fluid
                key={idx}
                value={snakeUrl}
                disabled={true}
              />
            )}
          </Form.Group>
          <Form.Group>
            <Form.Button
              content="Search"
              color="blue"
              onClick={this.handleSearchChallenger}
            />

            <Form.Button content="Run Game" onClick={this.handleStartGame} />

            {gameUrl &&
              <Form.Button onClick={() => { window.open(gameUrl) }}>{gameUrl}</Form.Button>
            }
          </Form.Group>
        </Form>
      </Segment>
    )
  }
}

export default userProvider(Bounty)
