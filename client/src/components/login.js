import React, { Component } from "react";
import { Input, Form, Button, Grid, Card } from "semantic-ui-react";

class Login extends Component {
  render() {
    return (
      <Grid centered fluid columns={2}>
        <Grid.Column>
          <Card>
            <Card.Content>
              <Form>
                <Form.Field>
                  <label>First Name</label>
                  <Input placeholder="First Name" />
                </Form.Field>
                <Form.Field>
                  <label>Last Name</label>
                  <Input placeholder="Last Name" />
                </Form.Field>
                <Button type="submit">Submit</Button>
              </Form>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
