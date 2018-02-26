import React, { Component } from 'react'
import { Grid, Container, Button, Table } from 'semantic-ui-react'

import logo from '../images/logo-bs18.png'

class Tournaments extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tournaments: [] // load existing tournaments here
    }
  }

  createTournaments () {
    fetch('/api/tournaments/create', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {'Content-Type': 'application/json'}
    }).then(resp => resp.json()).then(body => {
      console.log(body)
      // this.setState({
      //   tournaments: body
      // })
    })
  }

  render () {
    return (
      <Grid container>
        <Grid.Column width={4}>
          <img src={logo} className="App-logo" alt="logo" />
        </Grid.Column>
        <Grid.Column width={12}>
          <Container>
            <h1>Tournaments</h1>
            <Button onClick={this.createTournaments}>Create Tournaments</Button>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.tournaments.map(t => {
                  return (
                    <Table.Row>
                      <Table.Cell>
                        {t}
                      </Table.Cell>
                    </Table.Row>
                  )
                })}
              </Table.Body>
            </Table>
          </Container>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Tournaments
