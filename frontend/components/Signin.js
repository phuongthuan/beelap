import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Button, Card, CardBody, Alert } from 'reactstrap';

import InputField from './InputField';
import { validateSignin } from '../lib/utils';
import ErrorMessage from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`;

export default class Signin extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
  };

  handleChange = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async (e, signinMutation) => {
    e.preventDefault();
    const { email, password } = this.state;

    const errors = validateSignin(email, password);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }
    this.setState({ errors: [] });
    await signinMutation();
    this.setState({ email: '', password: '' });
  };

  render() {
    const { email, password, errors } = this.state;
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { loading, error }) => (
          <Card className="mx-auto" style={{ maxWidth: '350px' }}>
            <CardBody>
              <h2 className="text-center pb-3">Sign In</h2>
              <Form method="POST" onSubmit={e => this.handleSubmit(e, signin)}>
                {errors.length > 0 && (
                  <Alert color="danger">
                    {errors.map(err => (
                      <p size="small" key={err}>
                        {err}
                      </p>
                    ))}
                  </Alert>
                )}
                {error && <ErrorMessage message={error.message} />}
                <InputField
                  id="email"
                  size="lg"
                  value={email}
                  type="email"
                  name="email"
                  placeholder="Email"
                  handleChange={this.handleChange}
                />
                <InputField
                  id="password"
                  size="lg"
                  value={password}
                  type="password"
                  name="password"
                  placeholder="Password"
                  handleChange={this.handleChange}
                />
                <Button type="submit" color="primary">
                  {loading ? 'Sending...' : 'Sign In'}
                </Button>
              </Form>
            </CardBody>
          </Card>
        )}
      </Mutation>
    );
  }
}
