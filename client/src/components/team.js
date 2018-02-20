import React, { Component } from 'react'

import { Route, NavLink } from 'react-router-dom'
import { Grid, Container, Button, Image, Table } from 'semantic-ui-react'

import Snakes from './snakes'
import Nav from './nav'

import logo from '../images/logo-bs18.png'
import { members } from '../data/sampledata'

class Team extends Component {
  render () {
    return (
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
            <Route exact path="/team" component={TeamHome} />
            <Route path="/team/snakes" component={Snakes} />
          </Container>
        </Grid.Column>
      </Grid>
    )
  }
}

class TeamHome extends Component {
  render () {
    return (
      <Table celled inverted>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {members.map(member => {
            return (
              <Table.Row>
                <Table.Cell>
                  <Image
                    floated="left"
                    rounded
                    src={`https://github.com/${member.github}.png?size=40`}
                  />
                  {member.name}
                </Table.Cell>
                <Table.Cell />
                <Table.Cell textAlign="right">{member.email}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }
}

export default Team
