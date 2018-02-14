import React, { Component } from "react";
import { Table } from "semantic-ui-react";

class Snakes extends Component {
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
          <Table.Row>
            <Table.Cell>Yo yo</Table.Cell>
            <Table.Cell>here</Table.Cell>
            <Table.Cell textAlign="right">another</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default Snakes;
