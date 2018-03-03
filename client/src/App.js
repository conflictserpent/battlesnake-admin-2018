import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { userProvider } from './components/data'
import config from './config'
import Team from './Team'
import CreateTeam from './Team/create'
import Admin from './Admin'
import Tournaments, { TournamentActiveGame } from './Tournament'

import Bounty from './Bounty'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import axios from 'axios'
import { Container } from 'semantic-ui-react'

const LoginLink = () => <a href={`${config.SERVER}/auth/github`}>Login Here</a>

const LoadingScreen = () => <div>Loading !!1</div>

const ErrorScreen = () => <div>Problems abound ... </div>

const WelcomeScreen = () => <div>Welcome!</div>

const NoTeam = () => {
  return (
    <div>You are not currently on a team, please contact the person who registered your team, or head to the team registration desk to register.</div>
  )
}

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
  logout = async() => {
    try {
      await axios(`${config.SERVER}/self/logout`, {
        method: 'get',
        withCredentials: true
      })
      window.location.reload()
    } catch (e) {
      console.log(e)
    }
  }
  render() {
    const isActiveTournamentGame = window.location.pathname.endsWith('active-game')

    // Loading
    if (this.props.userMgr.loading) {
      return <LoadingScreen />
    }

    // Error
    if (this.props.userMgr.error) {
      return <ErrorScreen />
    }

    // Welcome screen
    if (!this.props.userMgr.loggedIn) {
      return <WelcomeScreen />
    }

    // Finally - on a team - can edit team, invite members, or leave team
    return (
      <Router>
        <div>
          {!isActiveTournamentGame &&
            <Container style={{ marginTop: '32px' }}>
              {!this.props.userMgr.loggedIn &&
                <LoginLink />
              }
              {!this.props.userMgr.user.teamId &&
                !this.props.userMgr.user.bountyCollector &&
                !this.props.userMgr.user.admin &&
                <NoTeam />
              }
              {this.props.userMgr.user.teamId &&
                <div>
                  <Route exact path="/" render={() => <Redirect to='/team' />} />
                  <Route path="/team" component={Team} />
                </div>
              }
              {this.props.userMgr.user.bountyCollector &&
                <Route path="/bounty" component={Bounty} />}
              {this.props.userMgr.user.admin &&
                <div>
                  <Route path="/new-team" component={CreateTeam} />
                  <Route path="/swu" component={Admin} />
                  <Route path="/tournament" component={Tournaments} />
                </div>
              }
            </Container>
          }
          {isActiveTournamentGame &&
            <Route exact path="/tournament/:id/active-game" component={TournamentActiveGame} />
          }
        </div>
      </Router>
    )
  }
}

export default userProvider(App)
