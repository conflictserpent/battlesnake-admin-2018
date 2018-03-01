import React, { Component } from 'react'
import axios from 'axios'
import config from '../../config'

export const teamProvider = ReactClass => {
  return class extends Component {
    displayName = 'teamProvider'
    state = {
      loading: true,
      error: null,
      team: {}
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
        const teamResp = await axios.get(`${config.SERVER}/api/team`, {
          withCredentials: true
        })
        this.setState({
          loading: false,
          team: teamResp.data
        })
      } catch (e) {
        this.handleError(e)
      }
    };

    render = () => <ReactClass teamMgr={{ ...this.state }} />;
  }
}
