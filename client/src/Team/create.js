import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import { Form, Button, Item } from 'semantic-ui-react'

const divisions = [
  { key: 'beginner', text: 'Beginner', value: 'beginner' },
  { key: 'intermediate', text: 'Intermediate', value: 'intermediate' },
  { key: 'expert', text: 'Expert', value: 'expert' }
]

class TeamFields extends Component {
  state = {
    teamName: '',
    description: '',
    division: '',
    loading: false,
    error: null
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async() => {
    this.setState({ loading: true })

    try {
      await axios(`${config.SERVER}/api/team/admin-create`, {
        method: 'post',
        withCredentials: true,
        data: {
          teamName: this.state.teamName,
          description: this.state.description,
          division: this.state.division,
          user: this.props.githubUser
        }
      })
      window.location.reload()
    } catch (e) {
      console.log(e)
      this.setState({ error: e })
    }

    this.setState({ loading: false })
  };

  render() {
    const { teamName, description, division } = this.state

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group>
          <Form.Input
            label="Team Name"
            placeholder="Team Name"
            name="teamName"
            value={teamName}
            onChange={this.handleChange}
            error={
              this.state.error &&
              this.state.error.field === 'teamName'
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.TextArea
            label="Team Description"
            placeholder="Team Description"
            name="description"
            value={description}
            onChange={this.handleChange}
          />
          <Form.Dropdown
            label="Division"
            options={divisions}
            name="division"
            value={division}
            placeholder="Division"
            onChange={this.handleChange}
            error={
              this.state.error &&
              this.state.error.field === 'divisions'
            }
          />
        </Form.Group>
        <Form.Button content="Submit" />
        <Button onClick={this.props.reset}>Reset</Button>
      </Form>
    )
  }
}

class GithubUsername extends Component {
  state = {
    username: '',
    user: null
  }
  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async() => {
    this.setState({ loading: true })

    try {
      const resp = await axios(`${config.SERVER}/api/github-username`, {
        method: 'post',
        withCredentials: true,
        data: {
          username: this.state.username
        }
      })
      console.log(resp.data)
      const user = {
        username: resp.data.login,
        avatar: resp.data.avatar_url,
        id: resp.data.id,
        displayName: resp.data.name,
        createdAt: resp.data.created_at
      }
      this.setState({user: user})
    } catch (e) {
      console.log(e)
      this.setState({ error: e })
    }

    this.setState({ loading: false })
  };

  continue = () => {
    this.props.updateUser(this.state.user)
  }

  back = () => {
    this.setState({user: null})
  }

  render() {
    const { username, user } = this.state

    return (
      <div>
        {!user &&
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            label="Github Username"
            placeholder="Github Username"
            name="username"
            value={username}
            onChange={this.handleChange}
          />
          <Form.Button content="Submit" />
        </Form>}
        {user &&
          <div>
            <Item.Group>
              <Item>
                <Item.Image size="tiny" src={user.avatar} />
                <Item.Content>
                  <Item.Header>{user.displayName}</Item.Header>
                  <Item.Meta>Created: {user.createdAt}</Item.Meta>
                </Item.Content>
              </Item>
            </Item.Group>
            <div>
              <Button onClick={this.continue}>Continue</Button>
              <Button onClick={this.back}>Back</Button>
            </div>
          </div>}
      </div>
    )
  }
}

export default class CreateTeam extends Component {
  state = {
    githubUser: null
  }

  updateUser = (githubUser) => {
    this.setState({
      validUsername: true,
      githubUser: githubUser
    })
  }

  render() {
    const { githubUser } = this.state
    return (
      <div>
        <h1>Create a new Team</h1>
        { !githubUser && <GithubUsername updateUser={this.updateUser} />}
        { githubUser && <TeamFields githubUser={githubUser} reset={() => this.setState({user: null})} /> }
      </div>
    )
  }
}
