import React, { Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import './App.css'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import { Grid, Container, Button } from 'semantic-ui-react'

import Login from './components/login'
import Team from './components/team'
import Snakes from './components/snakes'
import Tournaments from './components/tournaments'
import Nav from './components/nav'

import logo from './images/logo-bs18.png'

class App extends Component {
  render () {
    return (
      <Router>
        <div className="body-wrapper">
          <Grid container>
            <Grid.Column width={4}>
              <img src={logo} className="App-logo" alt="logo" />
              <Nav />
              <Button inverted as={NavLink} to="/login">
                Login Page
              </Button>
            </Grid.Column>
            <Grid.Column width={12}>
              <Container>
                <Route path="/team" component={Team} />
                <Route path="/snakes" component={Snakes} />
                <Route exact path="/login" component={Login} />
                <Route path="/tournaments" component={Tournaments} />
              </Container>
            </Grid.Column>
          </Grid>
        </div>
      </Router>
    )
  }
}

export default App
