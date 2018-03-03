import React, { Component } from 'react'
import axios from 'axios'
import config from '../../config'

export const membersProvider = ReactClass => {
  return class extends Component {
    displayName = 'membersProvider'
    state = {
      loading: true,
      error: null,
      members: []
    };

    handleError(e) {
      if (e.response && e.response.status === 401) {
        this.setState({
          loading: false
        })
        return
      }
      this.setState({
        error: e,
        loading: false
      })
    }

    componentDidMount = async() => {
      try {
        const membersResp = await axios.get(`${config.SERVER}/api/team/members`, {
          withCredentials: true
        })
        this.setState({
          loading: false,
          members: membersResp.data
        })
      } catch (e) {
        this.handleError(e)
      }
    };

    render = () => <ReactClass membersMgr={{ ...this.state }} {...this.props} />;
  }
}
