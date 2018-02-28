import * as React from 'react'
import { Route } from 'react-router-dom'
import { Grid, Container } from 'semantic-ui-react'
import BountyHome from './BountyHome'

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
