import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Button, Card, CardHeader, CardBody, Alert } from 'reactstrap';
import InputField from './InputField';
import { validate } from '../lib/utils';
import ErrorMessage from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

export default class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    errors: [],
  };

  handleChange = (value, name) => {
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async (e, signupMutation) => {
    e.preventDefault();
    const { name, email, password } = this.state;

    const errors = validate(name, email, password);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }
    this.setState({ errors: [] });
    await signupMutation();
    this.setState({ name: '', email: '', password: '' });
  };

  render() {
    const { name, email, password, errors } = this.state;
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, { loading, error }) => (
          <Card className="mx-auto" style={{ maxWidth: '350px' }}>
            <CardBody>
              <h2 className="text-center pb-3">Sign Up</h2>
              <Form method="POST" onSubmit={e => this.handleSubmit(e, signup)}>
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
                  id="name"
                  size="lg"
                  name="name"
                  value={name}
                  placeholder="Name"
                  handleChange={this.handleChange}
                />
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
                  {loading ? 'Sending...' : 'Sign Up'}
                </Button>
              </Form>
            </CardBody>
          </Card>
        )}
      </Mutation>
    );
  }
}
