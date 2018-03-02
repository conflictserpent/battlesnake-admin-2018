import React, { Component } from 'react'
import axios from 'axios'
import config from '../config'
import { Form, Message } from 'semantic-ui-react'

import { teamProvider } from '../components/data'


class RemoveMember extends Component {
    state = {
        result: 'test'
    }
    componentDidMount = async() => {
        const { match } = this.props
        try {
            await axios(`${config.SERVER}/api/team/remove-user`, {
              method: 'post',
              withCredentials: true,
              data: {
                username: match.params.username
              }
            })
          } catch (e) {
            this.setState({ error: e.response.data.msg })
          }
      }
  
  render() {
    return (
      <div>
       {this.state.error}
      </div>
    )
  }
}


export default RemoveMember
