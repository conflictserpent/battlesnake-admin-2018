import * as React from 'react'
import { userProvider } from '../components/data'
import { Form } from 'semantic-ui-react'
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
    const { game } = this.state
    console.log(game)

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

    body.bountySnakes.forEach((snake) => {
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
    console.log(body)

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
      <div>
        <hr />
        <h3>Game Setup</h3>

        <label>Game Width</label>
        <Form.Input
          placeholder='Game Width'
          name='width'
          onChange={this.handleFieldChange.bind(this, 'width')}
          value={width || ''}
        />

        <label>Game Height</label>
        <Form.Input
          placeholder='Game Height'
          name='height'
          onChange={this.handleFieldChange.bind(this, 'height')}
          value={height || ''}
        />

        <label>Health Points per Turn</label>
        <Form.Input
          placeholder='Health Points per Turn'
          name='decHealthPoints'
          onChange={this.handleFieldChange.bind(this, 'decHealthPoints')}
          value={decHealthPoints || ''}
        />

        <label>Turn Delay</label>
        <Form.Input
          placeholder='Turn Delay'
          name='turnDelay'
          onChange={this.handleFieldChange.bind(this, 'turnDelay')}
          value={turnDelay || ''}
        />

        <label>Max Food</label>
        <Form.Input
          placeholder='Max Food'
          name='maxFood'
          onChange={this.handleFieldChange.bind(this, 'maxFood')}
          value={maxFood || ''}
        />

        <label>Snake Start Length</label>
        <Form.Input
          placeholder='Snake Start Length'
          name='snakeStartLength'
          onChange={this.handleFieldChange.bind(this, 'snakeStartLength')}
          value={snakeStartLength || ''}
        />

        <label>Pin Tail</label>
        <Form.Input
          placeholder='Pin Tail'
          name='pinTail'
          onChange={this.handleFieldChange.bind(this, 'pinTail')}
          value={pinTail || ''}
        />

        <label>{"Bounty Snake URL's"}</label>
        <p>
          Setup a bounty snake url using mysnakename@http://mysnakeurl.com
        </p>
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

        <h3>User Snakes</h3>

        <label>Challenger Count</label>
        <Form.Input
          placeholder='Challenger Count'
          name='challengerCount'
          onChange={this.handleFieldChange.bind(this, 'challengerCount')}
          value={challengerCount || ''}
        />
        <label>Team Captain GitHub Username</label>
        <Form.Input
          placeholder='Team Captain GitHub Username'
          name='captainId'
          onChange={this.handleFieldChange.bind(this, 'captainId')}
          value={captainId || ''}
        />
        {challengerSnakes.map((snakeUrl, idx) =>
          <Form.Input
            key={idx}
            value={snakeUrl}
            disabled={true}
          />
        )}
        <Form.Button
          content="Search"
          onClick={this.handleSearchChallenger}
        />

        <Form.Button content="Run Game" onClick={this.handleStartGame} />

        {gameUrl &&
          <Form.Button onClick={() => { window.open(gameUrl) }}>{gameUrl}</Form.Button>
        }
      </div>
    )
  }
}

export default userProvider(Bounty)
