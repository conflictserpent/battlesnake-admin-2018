import React, { Component } from "react";
import { Image, Table } from "semantic-ui-react";
import { members } from "../data/sampledata";

class Team extends Component {
  render() {
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
            );
          })}
        </Table.Body>
      </Table>
    );
  }
}

export default Team;
