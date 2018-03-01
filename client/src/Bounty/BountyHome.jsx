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
        game: res.data
      })
    })
  }

  render() {
    const { loading, user } = this.props.userMgr
    const config = user.bountyCollector
    const { game } = this.state
    console.log(game)

    return (
      <div>
        <h1>Bounty</h1>
        {loading &&
          <p>Loading...</p>
        }
        {!loading &&
          <div>
            <p>
              Snake URLs: {config.snakeUrls.values.join(' ')}
            </p>
            <p>
              Board Width: {config.boardWidth}
            </p>
            <p>
              Board Height: {config.boardHeight}
            </p>
            <p>
              Max Food: {config.maxFood}
            </p>
            <p>
              Pin Tail: {config.pinTail}
            </p>
            <p>
              Snake Start Length: {config.snakeStartLength}
            </p>
            <p>
              Health Lost Per Turn: {config.decHealthPoints}
            </p>

            <div>
              <h3>Setup Game</h3>
              <Form.Input
                placeholder="Team Name"
                name="teamName"
                onChange={this.handleFieldChange.bind(this, 'teamName')}
                value={this.state.teamName || ''}
              />
              <Form.Button content="Setup" onClick={this.handleStartGame} />
            </div>

            {game &&
              <h4>
                <a target="_blank" href={game.gameUrl}>{game.gameUrl}</a>
              </h4>
            }
          </div>
        }
      </div>
    )
  }
}

export default userProvider(Bounty)
