import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import { Form, Message, Grid, Segment, Header } from 'semantic-ui-react'

import { teamProvider } from '../components/data'

const divisions = [
  { key: 'beginner', text: 'Beginner', value: 'beginner' },
  { key: 'intermediate', text: 'Intermediate', value: 'intermediate' },
  { key: 'expert', text: 'Expert', value: 'expert' }
]

class EditTeam extends Component {
  state = {
    snakeUrl: '',
    teamName: '',
    description: '',
    loading: false,
    success: false,
    error: null
  };

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
      success: false,
      error: false
    })
  };

  handleSubmit = async() => {
    this.setState({ loading: true })

    const { snakeUrl, teamName } = this.state

    if (snakeUrl === '') {
      this.setState({
        error: {
          field: 'snakeUrl',
          msg: 'Must have a valid snake URL'
        },
        loading: false
      })
      return
    }

    if (teamName === '') {
      this.setState({
        error: {
          field: 'teamName',
          msg: 'Must have a team name'
        },
        loading: false
      })
      return
    }

    try {
      await axios(`${config.SERVER}/api/team/update`, {
        method: 'post',
        withCredentials: true,
        data: {
          snakeUrl: this.state.snakeUrl,
          teamName: this.state.teamName,
          description: this.state.description,
          division: this.state.division
        }
      })
    } catch (e) {
      console.log(e)
      this.setState({ error: e })
    }

    this.setState({
      loading: false,
      success: true
    })
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.teamMgr.loading && !nextProps.teamMgr.loading) {
      this.setState({
        snakeUrl: nextProps.teamMgr.team.snakeUrl || '',
        teamName: nextProps.teamMgr.team.teamName || '',
        description: nextProps.teamMgr.team.description || '',
        division: nextProps.teamMgr.team.division || ''
      })
    }
  }

  render() {
    const { snakeUrl, teamName, description, division } = this.state
    return (
      <Grid
        textAlign='center'
        style={{ height: '100%' }}
        verticalAlign='middle'
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' color='teal' textAlign='center'>
            {' '}Edit your team
          </Header>
          <Form size='large'
            loading={this.props.teamMgr.loading || this.state.loading}
            error={this.state.error}
            success={!this.state.loading && this.state.success}
            onSubmit={this.handleSubmit}
            style={{ textAlign: 'left' }}>
            <Segment stacked>
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
              <Form.Input
                label="Snake URL"
                placeholder="Snake URL"
                name="snakeUrl"
                value={snakeUrl}
                onChange={this.handleChange}
                error={
                  this.state.error &&
                  this.state.error.field === 'snakeUrl'
                }
              />
              <Form.TextArea
                label="Team Description"
                placeholder="Team Description"
                name="description"
                value={description}
                onChange={this.handleChange}
                error={
                  this.state.error &&
                  this.state.error.field === 'description'
                }
              />
              <Form.Select
                label="Division"
                options={divisions}
                name="division"
                fluid
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
            <Message error>
              <p>{this.state.error && this.state.error.msg}</p>
            </Message>
            <Message success>
              <p>Team updated successfully</p>
            </Message>
          </Form>
        </Grid.Column>
      </Grid>
    )
  }
}

export default teamProvider(EditTeam)
