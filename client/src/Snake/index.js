import React, { Component } from 'react'
import axios from 'axios'
import { Form } from 'semantic-ui-react'
import config from '../config'
import { teamProvider } from '../components/data'

class Snake extends Component {
  state = { snakeUrl: '', teamName: '', loading: false, error: null };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async() => {
    this.setState({ loading: true })

    try {
      await axios(`${config.SERVER}/api/team`, {
        method: 'post',
        withCredentials: true,
        data: {
          snakeUrl: this.state.snakeUrl,
          teamName: this.state.teamName
        }
      })
    } catch (e) {
      console.log(e)
      this.setState({ error: e })
    }

    this.setState({ loading: false })
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.teamMgr.loading && !nextProps.teamMgr.loading) {
      this.setState({
        snakeUrl: nextProps.teamMgr.team.snakeUrl || '',
        teamName: nextProps.teamMgr.team.teamName || ''
      })
    }
  }

  render() {
    const { snakeUrl, teamName } = this.state
    return (
      <Form
        loading={this.props.teamMgr.loading || this.state.loading}
        onSubmit={this.handleSubmit}
      >
        {/* <Form.Group> */}
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
        <Form.Button content="Submit" />
        {/* </Form.Group> */}
      </Form>
    )
  }
}

export default teamProvider(Snake)
