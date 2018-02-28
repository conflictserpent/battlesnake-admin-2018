import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Grid, Container } from 'semantic-ui-react'

import logo from '../images/logo-bs18.png'

class Admin extends Component {
  render() {
    return (
      <Grid container>
        <Grid.Column width={4}>
          <img src={logo} className="App-logo" alt="logo" />
        </Grid.Column>
        <Grid.Column width={12}>
          <Container>
            <Route exact path="/swu" component={SwuHome} />
          </Container>
        </Grid.Column>
      </Grid>
    )
  }
}

class SwuHome extends Component {
  render() {
    return (<h1>SWU HOME</h1>)
  }
}

export default Admin
