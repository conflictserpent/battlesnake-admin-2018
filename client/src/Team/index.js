import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Grid, Container, Image, Table, Header, Button, Icon, Label, Message } from 'semantic-ui-react'

import Snakes from '../components/snakes'
import Nav from '../components/nav'

import { membersProvider, teamProvider, userProvider } from '../components/data'

import TeamEdit from './edit'
import AddMember from './add-member'

import axios from 'axios'
import config from '../config'

import logo from '../images/logo-bs18.png'

class Team extends Component {
  state = {
    canEdit: false
  }

  componentDidMount = async() => {
    try {
      const resp = await axios(`${config.SERVER}/api/team/can-edit`, {
        method: 'get',
        withCredentials: true
      })

      this.setState({canEdit: resp.data.can_edit})
    } catch (e) {
      this.setState({ error: e.response.data.msg })
    }
  }

  render() {
    const {canEdit} = this.state
    console.log(canEdit)
    return (
      <div>
        <Grid verticalAlign='bottom'>
          <Grid.Column width={4}>
            <Link to="/">
              <img src={logo} className="App-logo" alt="logo" />
            </Link>
          </Grid.Column>
          <Grid.Column width={12}>
            <Header
              as='h1'
              inverted
            >Team Page
              {canEdit && <Button inverted size='small' floated='right' href="team/edit">
                Edit Team
                <Icon name='pencil' />
              </Button>}
            </Header>

          </Grid.Column>
        </Grid>

        <Grid container>
          <Grid.Column width={4}>
            <Nav bountyCollector={this.props.userMgr.user.bountyCollector} />
          </Grid.Column>
          <Grid.Column width={12}>
            <Container>
              <Route exact path="/team" render={() => (<TeamHome canEdit={canEdit} />)} />
              <Route path="/team/edit" render={() => (<TeamEdit canEdit={canEdit} />)} />
              <Route path="/team/snakes" component={teamProvider(Snakes)} />
            </Container>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

class TeamDetailDisplay extends Component {
  render() {
    let team = !this.props.teamMgr.loading
      ? this.props.teamMgr.team
      : {}

    return (
      <div>
        <Header as='h2' color='teal'>{team.teamName} <Label color='teal'>{team.division}</Label></Header>
        <Message size="small">{team.description}</Message>
        <code>{team.snakeUrl}</code>
      </div>
    )
  }
}

class TeamHomeDisplay extends Component {
  removeMember = async(username) => {
    try {
      await axios(`${config.SERVER}/api/team/remove-user`, {
        method: 'post',
        withCredentials: true,
        data: {
          username: username
        }
      })
    } catch (e) {
      this.setState({ error: e.response.data.msg })
    }
    window.location.reload()
  }

  render() {
    let members = !this.props.membersMgr.loading
      ? this.props.membersMgr.members
      : []

    const { canEdit } = this.props

    return (
      <div>
        <TeamDetail />
        <Table celled inverted verticalAlign='middle' sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {members.map(member => {
              return (
                <Table.Row key={member.username}>
                  <Table.Cell verticalAlign="middle">
                    <Image
                      width="50"
                      height="50"
                      floated="left"
                      rounded
                      src={`https://github.com/${member.username}.png?size=40`}
                    />
                    {member.displayName || member.username}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    <Button inverted color='red' size='small' onClick={() => this.removeMember(member.username)}>
                      Remove
                      <Icon name='x' />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )
            })}
            {canEdit &&
            <Table.Row>
              <Table.Cell />
              <Table.Cell textAlign="right">
                <Link to="/team/edit" className="ui button">
                  <Icon name="pencil" /> Edit Team
                </Link>
              </Table.Cell>
            </Table.Row>}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan='2'>
                <AddMember />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  }
}
const TeamHome = membersProvider(TeamHomeDisplay)
const TeamDetail = teamProvider(TeamDetailDisplay)

export default userProvider(Team)
