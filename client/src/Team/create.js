import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import { Form, Button, Grid, Header, Segment, Message, Card, Image, Icon } from 'semantic-ui-react'

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
      <Grid
        textAlign='center'
        style={{ height: '100%' }}
        verticalAlign='middle'
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' color='teal' textAlign='center'>
            {' '}Create a team
          </Header>
          <Form size='large' onSubmit={this.handleSubmit} style={{ textAlign: 'left' }}> 
            <Segment stacked>
              <Form.Input
                label="Team Name"
                placeholder="Team Name"
                name="teamName"
                fluid
                value={teamName}
                onChange={this.handleChange}
                error={
                  this.state.error &&
                  this.state.error.field === 'teamName'
                }
              />
              <Form.TextArea
                label="Team Description"
                placeholder="Team Description"
                name="description"
                value={description}
                onChange={this.handleChange}
              />
              <Form.Select
                label="Division"
                options={divisions}
                fluid
                name="division"
                value={division}
                placeholder="Division"
                onChange={this.handleChange}
                error={
                  this.state.error &&
                  this.state.error.field === 'divisions'
                }
              />
              <Form.Button color='teal' fluid size='large'>Submit</Form.Button>
            </Segment>
          </Form>
          <Message>
            <Button onClick={this.props.reset}>Reset</Button>
          </Message>
        </Grid.Column>
      </Grid>
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
      const user = {
        username: resp.data.login,
        avatar: resp.data.avatar_url,
        id: resp.data.id,
        displayName: resp.data.name,
        createdAt: resp.data.created_at
      }
      this.setState({user: user})
    } catch (e) {
      this.setState({ error: e })
    }

    this.setState({ loading: false })
  };

  continue = () => {
    this.props.updateUser(this.state.user)
  }

  back = () => {
    this.setState({ user: null })
  }

  render() {
    const { username, user } = this.state

    return (
      <div>
        <Grid
          textAlign='center'
          style={{ height: '100%' }}
          verticalAlign='middle'
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h1' color='teal' textAlign='center'>
              {' '}Create a team
            </Header>
            {!user &&
              <Segment stacked>
                <Form size='large' onSubmit={this.handleSubmit} style={{ textAlign: 'left' }}>
                  <Form.Input
                    label="Github Username"
                    placeholder="Github Username"
                    name="username"
                    value={username}
                    onChange={this.handleChange}
                  />
                  <Form.Button color='teal' fluid size='large'>Submit</Form.Button>
                </Form>
              </Segment>
            }
            {user &&
              <Card centered>
                <Image alt={user.username} src={user.avatar} />
                <Card.Content>
                  <Card.Header>
                    <Icon name="github" />
                    {user.username}
                  </Card.Header>
                  <Card.Meta>
                    <span className='date'>
                      Created: {user.createdAt}
                    </span>
                  </Card.Meta>
                  <Card.Description>
                    {user.displayName}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button.Group widths={'3'}>
                    <Button onClick={this.back}>Back</Button>
                    <Button.Or />
                    <Button onClick={this.continue} positive color='teal'>Continue</Button>
                  </Button.Group>
                </Card.Content>
              </Card>
            }

          </Grid.Column>
        </Grid>

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
        {!githubUser && <GithubUsername updateUser={this.updateUser} />}
        {githubUser && <TeamFields githubUser={githubUser} reset={() => this.setState({ user: null })} />}
      </div>
    )
  }
}
