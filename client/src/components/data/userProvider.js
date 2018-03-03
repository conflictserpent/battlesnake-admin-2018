import React, { Component } from 'react'
import axios from 'axios'
import config from '../../config'

export const userProvider = ReactClass => {
  return class extends Component {
    displayName = 'userProvider';
    state = {
      loading: true,
      loggedIn: null,
      error: null,
      user: {}
    };

    handleError(e) {
      if (e.response && e.response.status === 401) {
        this.setState({
          loading: false,
          loggedIn: false
        })
        window.location = `${config.SERVER}/auth/github`
        return
      }
      this.setState({
        error: e,
        loading: false
      })
    }

    componentDidMount = async() => {
      try {
        const userResponse = await axios.get(`${config.SERVER}/api/self`, {
          withCredentials: true
        })
        axios.defaults.headers.common['x-csrf-token'] =
          userResponse.headers.csrftoken

        this.setState({
          loading: false,
          loggedIn: true,
          user: userResponse.data
        })
      } catch (e) {
        this.handleError(e)
      }
    };

    render = () => <ReactClass userMgr={{ ...this.state }} />;
  }
}
