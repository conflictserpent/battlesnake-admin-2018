import * as React from 'react'
import { Route } from 'react-router-dom'
import { Grid, Container, Image, Table, Form } from 'semantic-ui-react'
import Nav from '../components/nav'
import BountyHome from './BountyHome'
import logo from '../images/logo-bs18.png'

class Bounty extends React.Component {
  render() {
    return (
      <Grid container>
        <Grid.Column width={12}>
          <Container>
            <Route exact path="/bounty" component={BountyHome} />
          </Container>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Bounty
