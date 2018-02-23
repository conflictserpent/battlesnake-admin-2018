import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import config from "./config";
import Home from "./Home";
import Login from "./components/login";
import Team from "./components/team";
import Tournaments from "./components/tournaments";
import "semantic-ui-css/semantic.min.css";
import "./App.css";

const userManager = Clz => {
  return class extends Component {
    state = {
      loading: true,
      loggedIn: null,
      error: null,
      user: {}
    };

    componentDidMount = async () => {
      try {
        const user = await axios.get(`${config.SERVER}/self`, {
          withCredentials: true
        });
        console.log("user", user);
        this.setState({
          loading: false,
          loggedIn: true,
          user
        });
      } catch (e) {
        if (e.response && e.response.status === 401) {
          this.setState({
            loading: false,
            loggedIn: false
          });
        } else {
          this.setState({
            error: e,
            loading: false
          });
        }
      }
    };

    render = () => <Clz userMgr={{ ...this.state }} />;
  };
};

const LoginLink = () => <a href={`${config.SERVER}/auth/github`}>Login Here</a>;

class App extends Component {
  render() {
    console.log(this.props.userMgr);
    return (
      <Router>
        <div className="body-wrapper">
          {!this.props.userMgr.loggedIn && <LoginLink />}
          <Route exact path="/" component={Home} />
          <Route path="/team" component={Team} />
          <Route path="/login" component={Login} />
          <Route path="/tournaments" component={Tournaments} />
        </div>
      </Router>
    );
  }
}

export default userManager(App);
