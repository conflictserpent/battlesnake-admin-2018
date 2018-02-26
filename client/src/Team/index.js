import React, { Component } from "react";
import { Route, NavLink } from "react-router-dom";
import { Grid, Container, Button, Image, Table } from "semantic-ui-react";

import Snakes from "../components/snakes";
import Nav from "../components/nav";
import { membersProvider } from "../components/data";

import logo from "../images/logo-bs18.png";

class Team extends Component {
  render() {
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
    );
  }
}

class TeamHomeDisplay extends Component {
  render() {
    let members = !this.props.membersMgr.loading
      ? this.props.membersMgr.members
      : [];
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
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}
const TeamHome = membersProvider(TeamHomeDisplay);

export default Team;
