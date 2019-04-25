import React from 'react';
import { Alert } from 'reactstrap';
import Head from 'next/head';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import User from './User';
import Form from './styles/Form';
import BeeButton from './styles/BeeButton';

const UPDATE_PROFILE_MUTATION = gql`
  mutation UPDATE_PROFILE_MUTATION($name: String) {
    updateUser(name: $name) {
      id
      name
      email
    }
  }
`;

const WRITE_ALERT_MESSAGE = gql`
  mutation WRITE_ALERT_MESSAGE($message: String!) {
    writeAlertMessage(message: $message) @client
  }
`;

class Profile extends React.Component {
  state = {
    errors: [],
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (
    e,
    updateProfileMutation,
    writeAlertMessageMutation
  ) => {
    e.preventDefault();
    delete this.state.errors;
    const newProfile = await updateProfileMutation();
    if (newProfile) {
      writeAlertMessageMutation({
        variables: {
          message: 'Update profile successfully!',
        },
      });
    }
  };

  render() {
    const { errors } = this.state;
    return (
      <>
        <Head>
          <title>My Profile</title>
        </Head>
        <User>
          {({ data }) => {
            const me = data ? data.me : null;
            return (
              <Mutation
                mutation={UPDATE_PROFILE_MUTATION}
                variables={this.state}
              >
                {(updateProfile, { loadingMutation, error }) => (
                  <Mutation mutation={WRITE_ALERT_MESSAGE}>
                    {writeAlertMessage => (
                      <Form
                        width="500px"
                        className="mt-5"
                        onSubmit={e =>
                          this.handleSubmit(e, updateProfile, writeAlertMessage)
                        }
                      >
                        <h2 className="text-center pb-3">My Profile</h2>
                        {errors.length > 0 && (
                          <Alert color="danger">
                            {errors.map(err => (
                              <p size="small" key={err}>
                                {err}
                              </p>
                            ))}
                          </Alert>
                        )}
                        <label htmlFor="Email">
                          Email
                          <input
                            id="email"
                            defaultValue={me.email}
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={this.handleChange}
                            disabled
                          />
                        </label>

                        <label htmlFor="Name">
                          Name
                          <input
                            id="name"
                            defaultValue={me.name}
                            type="name"
                            name="name"
                            placeholder="Name"
                            onChange={this.handleChange}
                          />
                        </label>
                        <BeeButton type="submit" className="mt-3">
                          {loadingMutation ? 'Updating...' : 'Update profile'}
                        </BeeButton>
                      </Form>
                    )}
                  </Mutation>
                )}
              </Mutation>
            );
          }}
        </User>
      </>
    );
  }
}

export default Profile;
export { WRITE_ALERT_MESSAGE };
