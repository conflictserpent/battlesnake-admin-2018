import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import { Form, Message } from 'semantic-ui-react'

import { teamProvider } from '../components/data'


class AddMember extends Component {
  state = {
    newUsername: '',
    success: false,
    error: false
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
    } catch (e) {
      console.log(e)
      this.setState({ error: e })
    }

    this.setState({
      success: true
    })
  };
  
  render() {
    const { newUsername } = this.state
    return (
      <div>
        <Form
        error={this.state.error}
        success={this.state.success}
        onSubmit={this.handleSubmit}
      >
        <h1>Add User</h1>
        <Form.Group>
          <Form.Input
            label="GitHub Username"
            placeholder="GitHub Username"
            name="newUsername"
            value={newUsername}    
            onChange={this.handleChange}
            error={
              this.state.error &&
              this.state.error.field === 'newUsername'
            }
          />
        </Form.Group>        
        <Message error>
          <p>{this.state.error && this.state.error.msg}</p>
        </Message>
        <Message success>
          <p>Added successfully</p>
        </Message>
        <Form.Button content="Submit" />

        <br/>
      </Form>
      </div>
    )
  }
}

export default teamProvider(AddMember)
