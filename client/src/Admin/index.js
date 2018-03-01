import React, { Component } from 'react'
import { Route, NavLink } from 'react-router-dom'
import { Grid, Container, Table } from 'semantic-ui-react'

import logo from '../images/logo-bs18.png'
import axios from 'axios'
import config from '../config'

class AdminNav extends Component {
  render() {
    return (
      <nav>
        <NavLink exact className="link" to="/swu/teams">
          Teams
        </NavLink>
      </nav>
    )
  }
}

class Admin extends Component {
  render() {
    return (
      <Grid container>
        <Grid.Column width={4}>
          <img src={logo} className="App-logo" alt="logo" />
          <AdminNav />
        </Grid.Column>
        <Grid.Column width={12}>
          <Container>
            <Route exact path="/swu" component={SwuHome} />
            <Route path="/swu/teams" component={SwuTeams} />
          </Container>
        </Grid.Column>
      </Grid>
    )
  }
}

class SwuHome extends Component {
  render() {
    return (
      <div>
        <h1>SWU HOME</h1>
      </div>
    )
  }
}

class SwuTeams extends Component {
  state = {
    teams: []
  }

  componentDidMount = async() => {
    console.log('loading teams')
    const resp = await axios(`${config.SERVER}/api/swu/teams/`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })
    this.setState({teams: resp.data})
  }

  render() {
    const {teams} = this.state
    return (
      <div>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Team Name</Table.HeaderCell>
              <Table.HeaderCell>Captain Id</Table.HeaderCell>
              <Table.HeaderCell>Snake URL</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Division</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {teams.map(t => {
              return (
                <Table.Row key={t.captainId}>
                  <Table.Cell>{t.teamName}</Table.Cell>
                  <Table.Cell>{t.captainId}</Table.Cell>
                  <Table.Cell>{t.snakeUrl}</Table.Cell>
                  <Table.Cell>{t.description}</Table.Cell>
                  <Table.Cell>{t.division}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

export default Admin
