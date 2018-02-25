import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import config from "./config";
import Home from "./Home";
import Team from "./components/team";
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

    render = () => <Clz userMgr={{ ...this.state }} />;
  };
};

const LoginLink = () => <a href={`${config.SERVER}/auth/github`}>Login Here</a>;

const LoadingScreen = () => <div>Loading !!1</div>;

const ErrorScreen = () => <div>Problems abound ... </div>;

const WelcomeScreen = () => <div>Welcome!</div>;

/**
 * Things required:
 *  - Loading √
 *  - Error √
 *  - User not logged in
 *  - User logged in, no team
 *  -- ask if wants to be a captain
 *  -- or wait for invitation
 *  - If team captain / team member
 *  -- Team member screen (invite others)
 *  -- Snake management
 */
class App extends Component {
  render() {
    // Loading
    if (this.props.userMgr.loading) {
      return <LoadingScreen />;
    }

    // Error
    if (this.props.userMgr.error) {
      return <ErrorScreen />;
    }

    // Welcome screen
    if (!this.props.userMgr.loggedIn) {
      return <WelcomeScreen />;
    }
    
    // Not on a team
    if (!this.props.userMgr.user.teamId) {
      // Need to join a squad or become a team capt'n
      console.log('need to team up') 
    }
    
    // Finally - on a team - can edit team, invite members, or leave team

    return (
      <Router>
        <div className="body-wrapper">
          {!this.props.userMgr.loggedIn && <LoginLink />}
          <Route exact path="/" component={Home} />
          <Route path="/team" component={Team} />
        </div>
      </Router>
    );
  }
}

export default userManager(App);
