import React, { Component } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Alert } from 'reactstrap';

import { validate } from '../lib/utils';
import ErrorMessage from './ErrorMessage';
import BeeButton from './styles/BeeButton';
import Form from './styles/Form';
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

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = async (e, signinMutation) => {
    e.preventDefault();
    const errors = validate(this.state);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    this.setState({ errors: [] });

    await signinMutation();
    this.setState({ email: '', password: '' });
    Router.push({
      pathname: '/',
    });
  };

  render() {
    const { email, password, errors } = this.state;
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { loading, error }) => {
          console.log(error && error.message);

          const displayMessage = () => {
            if (error && error.message === 'GraphQL error: Invalid Password!') {
              return 'Invalid password, we can help you reset your password!';
            }
          };

          return (
            <Form
              className="mt-5"
              method="POST"
              onSubmit={e => this.handleSubmit(e, signin)}
            >
              <h2 className="text-center pb-5">Sign In</h2>
              {errors.length > 0 && (
                <Alert color="danger">
                  {errors.map(err => (
                    <p size="small" key={err}>
                      {err}
                    </p>
                  ))}
                </Alert>
              )}
              {error && <ErrorMessage message={displayMessage()} />}
              <label htmlFor="Email">
                <input
                  id="email"
                  value={email}
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="Password">
                <input
                  id="password"
                  value={password}
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.handleChange}
                />
              </label>

              {/* Forgot Password */}
              <Link
                href={{
                  pathname: '/request-reset',
                }}
              >
                <a>Forgot your password?</a>
              </Link>

              {/* Sign Up */}
              <Link
                href={{
                  pathname: '/signup',
                }}
              >
                <a>Don't have account? Sign up</a>
              </Link>

              <BeeButton type="submit">
                {loading ? 'Sending...' : 'Sign In'}
              </BeeButton>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}
