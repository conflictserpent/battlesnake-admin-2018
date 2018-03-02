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
        game: res.data,
        error: null,
      })
    }).catch(error => {
      this.setState({ error: error.message })
    })
  }

  render() {
    const { loading, user } = this.props.userMgr
    const config = user.bountyCollector
    const { game, error } = this.state
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
  }

  handleFieldChange = (name, ev) => {
    this.setState({
      [name]: ev.target.value
    })
  }

  handleAddSnake = (name, idx, ev) => {
    const snakes = this.state.bountySnakes.slice()
    snakes[idx] = ev.target.value
    this.setState({ bountySnakes: snakes })
  }

  handleIncrSnakes = () => {
    this.setState({ bountySnakes: this.state.bountySnakes.concat(['']) })
  }

  handleStartGame = (ev) => {
    axios(`${config.SERVER}/api/team/${this.state.teamName}/start-bounty-game`, {
      method: 'post',
      withCredentials: true
    }).then(res => {
      this.setState({
        game: res.data,
        error: null,
      })
    }).catch(error => {
      this.setState({ error: error.message })
    })
  }

  render() {
    const { user } = this.props
    const {
      snakeCount,
      game,
      width,
      height,
      captainId,
      bountySnakes,
    } = this.state

    console.log('snakes', bountySnakes)

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
          onChange={this.handleFieldChange.bind(this, 'height')}
          value={height || ''}
        />

        <label>Bounty Snake URL's</label>
        {bountySnakes.map((snake, idx) =>
          <Form.Input
            key={idx}
            placeholder={`Bounty Snake ${idx+1}`}
            name='bountySnake'
            onChange={this.handleAddSnake.bind(this, 'bountySnakes', idx)}
            value={bountySnakes[idx] || ''}
          />
        )}

        <Form.Button
          content="Add Snake"
          onClick={this.handleIncrSnakes}
        />

        <h3>User Snakes</h3>
        <Form.Input
          placeholder='Team Captain GitHub Username'
          name='captainId'
          onChange={this.handleFieldChange.bind(this, 'captainId')}
          value={captainId || ''}
        />
        <Form.Button
          content="Search"
          onClick={this.handleIncrSnakes}
        />

        <Form.Button content="Run Game" onClick={this.handleStartGame} />
    </div>
    )
  }
}

export default userProvider(Bounty)
