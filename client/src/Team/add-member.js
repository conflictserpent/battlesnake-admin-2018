import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import { Form, Message, Icon, Header, Grid } from 'semantic-ui-react'

import { teamProvider } from '../components/data'

class AddMember extends Component {
  state = {
    newUsername: '',
    success: false,
    error: null
  };

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
      success: false,
      error: null
    })
  };

  handleSubmit = async() => {
    this.setState({ loading: true })

    const { newUsername } = this.state

    if (newUsername === '') {
      this.setState({
        error: {
          field: 'newUsername',
          msg: 'Must have a valid GitHub username'
        }
      })
      return
    }
    try {
      await axios(`${config.SERVER}/api/team/add-user`, {
        method: 'post',
        withCredentials: true,
        data: {
          username: this.state.newUsername
        }
      })
      this.setState({
        success: true
      })
      window.location.reload()
    } catch (e) {
      this.setState({ error: e.response.data.msg })
    }
  };

  render() {
    const { newUsername } = this.state
    return (
      <Form
        inverted
        error={this.state.error}
        success={this.state.success}
        onSubmit={this.handleSubmit}
      >
      <Header inverted textAlign="center" as="h3">Add a new team member</Header>
      <Grid centered padded>
        <Form.Group>
          <Form.Field inline>
            <Form.Input 
              placeholder='GitHub Username'
              inverted
              value={newUsername}
              onChange={this.handleChange}
              name="newUsername"
              error={
                this.state.error &&
                this.state.error.field === 'newUsername'
              } />
          </Form.Field>
          <Form.Button inverted color='blue'>
            Add Member
          <Icon name='add' />
        </Form.Button>
        </Form.Group>

        <Message error>
          <p>{this.state.error}</p>
        </Message>
        <Message success>
          <p>Added successfully</p>
        </Message>

        </Grid>
      </Form>
    )
  }
}

export default teamProvider(AddMember)
