import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import { Form } from 'semantic-ui-react'

export default class CreateTeam extends Component {
  state = {
    snakeUrl: '',
    teamName: '',
    description: '',
    loading: false,
    error: null
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async () => {
    this.setState({ loading: true })

    try {
      await axios(`${config.SERVER}/api/self/captain-on`, {
        method: 'post',
        withCredentials: true,
        data: {
          snakeUrl: this.state.snakeUrl,
          teamName: this.state.teamName
          // description: this.state.description // Doesn't work quite yet
        }
      })
      window.location = '/'
    } catch (e) {
      console.log(e)
      this.setState({ error: e })
    }

    this.setState({ loading: false })
  };

  render () {
    const { snakeUrl, teamName, description } = this.state
    return (
      <div>
        <h1>Create a new Team</h1>
        <Form
          onSubmit={this.handleSubmit}
        >
          <Form.Input
            placeholder="Team Name"
            name="teamName"
            value={teamName}
            onChange={this.handleChange}
          />
          <Form.Input
            placeholder="Snake URL"
            name="snakeUrl"
            value={snakeUrl}
            onChange={this.handleChange}
          />
          <Form.TextArea
            placeholder="Team Description"
            name="description"
            value={description}
            onChange={this.handleChange}
          />
          <Form.Button content="Submit" />
        </Form>
      </div>
    )
  }
}
