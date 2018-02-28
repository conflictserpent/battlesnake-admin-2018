import React, { Component } from 'react'
import axios from 'axios'
import { Route } from 'react-router-dom'
import config from '../config'
import { Grid, Container, Image, Table, Form } from 'semantic-ui-react'

import Snakes from '../components/snakes'
import Nav from '../components/nav'
import { membersProvider } from '../components/data'

import logo from '../images/logo-bs18.png'

class Team extends Component {
  render() {
    return (
      <Grid container>
        <Grid.Column width={4}>
          <img src={logo} className="App-logo" alt="logo" />
          <Nav />
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

class TeamHomeDisplay extends Component {
  render() {
    let members = !this.props.membersMgr.loading
      ? this.props.membersMgr.members
      : []
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
                    src={`https://github.com/${member.username}.png?size=40`}
                  />
                  {member.displayName || member.username}
                </Table.Cell>
                <Table.Cell />
                <Table.Cell textAlign="right">
                  {member.displayName || member.username}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }
}
const TeamHome = membersProvider(TeamHomeDisplay)

export class CreateTeam extends Component {
  state = { snakeUrl: '', teamName: '', loading: false, error: null };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit = async() => {
    const { snakeUrl, teamName } = this.state
    console.log(snakeUrl, teamName)
    this.setState({ loading: true })
    try {
      await axios(`${config.SERVER}/api/self/captain-on`, {
        method: 'post',
        withCredentials: true,
        data: {
          snakeUrl: this.state.snakeUrl,
          teamName: this.state.teamName
        }
      })
      window.location = '/'
    } catch (e) {
      console.log(e)
      this.setState({ error: e })
    }
    this.setState({ loading: false })
  };
  render() {
    const { snakeUrl, teamName } = this.state
    return (
      <div>
        <h1>Create a new Team</h1>
        <Form
          onSubmit={this.handleSubmit}
        >
          <Form.Input
            placeholder="Team Name"
            name="teamName"
            value={teamName}
            onChange={this.handleChange}
          />
          <Form.Input
            placeholder="Snake URL"
            name="snakeUrl"
            value={snakeUrl}
            onChange={this.handleChange}
          />
          <Form.Button content="Submit" />
        </Form>
      </div>
    )
  }
}

export default Team
