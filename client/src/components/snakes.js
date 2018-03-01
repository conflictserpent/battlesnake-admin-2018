import React, { Component } from 'react'
import { Container, Table, Form } from 'semantic-ui-react'

import axios from 'axios'
import config from '../config'

class Snakes extends Component {
  state = {
    snakes: [],
    selected: []
  }

  componentDidMount = () => {
    this.loadSnakes()
  }

  loadSnakes = async() => {
    const resp = await axios(`${config.SERVER}/api/snakes/`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
    })
    this.setState({snakes: resp.data})
  }

  selectSnake = (snake) => {
    let { selected } = this.state
    if (selected.indexOf(snake) === -1) {
      selected.push(snake)
    } else {
      selected = selected.filter(s => s !== snake)
    }
    this.setState({selected})
  }

  render() {
    const {snakes} = this.state
    return (
      <Container>
        <Table celled inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell/>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {snakes.map(s => {
              return (
                <Table.Row key={s.name}>
                  <Table.Cell>
                    <Form.Checkbox onChange={() => this.selectSnake(s)} />
                  </Table.Cell>
                  <Table.Cell>{s.name}</Table.Cell>
                  <Table.Cell>{s.url}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>

        <Form>
        </Form>
      </Container>
    )
  }
}

export default Snakes
