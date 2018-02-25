import React, { Component } from "react";
import axios from "axios";
import config from "../../config";

export const userProvider = ReactClass => {
  return class extends Component {
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
        });
        return;
      }
      this.setState({
        error: e,
        loading: false
      });
    }

    componentDidMount = async () => {
      try {
        const userResponse = await axios.get(`${config.SERVER}/self`, {
          withCredentials: true
        });
        this.setState({
          loading: false,
          loggedIn: true,
          user: userResponse.data
        });
      } catch (e) {
        this.handleError(e);
      }
    };

    render = () => <ReactClass userMgr={{ ...this.state }} />;
  };
};

