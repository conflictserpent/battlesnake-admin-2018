import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import { Form, Message } from 'semantic-ui-react'

import { teamProvider } from '../components/data'

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
      success: '',
      error: ''
    })
  };

  handleSubmit = async () => {
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
          teamName: this.state.teamName
          // description: this.state.description // Doesn't work quite yet
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

  componentWillReceiveProps (nextProps) {
    if (this.props.teamMgr.loading && !nextProps.teamMgr.loading) {
      this.setState({
        snakeUrl: nextProps.teamMgr.team.snakeUrl || '',
        teamName: nextProps.teamMgr.team.teamName || '',
        description: nextProps.teamMgr.team.description || ''
      })
    }
  }

  render () {
    const { snakeUrl, teamName, description } = this.state
    return (
      <Form
        loading={this.props.teamMgr.loading || this.state.loading}
        error={this.state.error && this.state.error.msg}
        success={!this.state.loading && this.state.success}
        onSubmit={this.handleSubmit}
      >
        <h1>Edit Team</h1>
        <Form.Input
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
          placeholder="Team Description"
          name="description"
          value={description}
          onChange={this.handleChange}
          error={
            this.state.error &&
            this.state.error.field === 'description'
          }
        />
        <Message error>
          <p>{this.state.error && this.state.error.msg}</p>
        </Message>
        <Message success>
          <p>Team updated successfully</p>
        </Message>
        <Form.Button content="Submit" />
      </Form>
    )
  }
}

export default teamProvider(EditTeam)
