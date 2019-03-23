import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Alert } from 'reactstrap';

import { validate } from '../lib/utils';
import ErrorMessage from './ErrorMessage';
import Form from './styles/Form';
import BeeButton from './styles/BeeButton';

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

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e, signupMutation) => {
    e.preventDefault();

    const errors = validate(this.state);

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
          <Form
            className="mt-5"
            method="POST"
            onSubmit={e => this.handleSubmit(e, signup)}
          >
            <h2 className="text-center pb-3">Sign Up</h2>
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
            <label htmlFor="Name">
              Name
              <input
                id="name"
                name="name"
                value={name}
                onChange={this.handleChange}
              />
            </label>
            <label htmlFor="Email">
              Email
              <input
                id="email"
                value={email}
                type="email"
                name="email"
                onChange={this.handleChange}
              />
            </label>
            <label htmlFor="Password">
              Password
              <input
                id="password"
                value={password}
                type="password"
                name="password"
                onChange={this.handleChange}
              />
            </label>
            <BeeButton type="submit">
              {loading ? 'Sending...' : 'Sign Up'}
            </BeeButton>
          </Form>
        )}
      </Mutation>
    );
  }
}
