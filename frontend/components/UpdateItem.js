import React, { Component } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Card, CardBody, Alert, Button } from 'reactstrap';

import InputField from './InputField';
import ErrorMessage from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(id: $id) {
      id
      title
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {
    errors: [],
  };

  handleChange = (value, name) => {
    let val;
    switch (name) {
      case 'price':
        val = Number(value);
        break;
      default:
        val = value;
    }

    this.setState({ [name]: val });
  };

  handleSubmit = async (e, updateItemMutation) => {
    e.preventDefault();
    delete this.state.errors;
    await updateItemMutation({
      variables: {
        ...this.state,
        id: this.props.id,
      },
    });
    Router.push('/');
  };

  render() {
    const { errors } = this.state;
    const { id } = this.props;
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading...</div>;

          if (error) return <div>{error.message}</div>;

          if (!data.item) return <p>No item found for ID {id}</p>;

          const { item } = data;

          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loadingMutation, error }) => (
                <Card className="mx-auto" style={{ maxWidth: '450px' }}>
                  <CardBody>
                    <h2 className="text-center pb-3">Update Item</h2>
                    <Form
                      method="POST"
                      onSubmit={e => this.handleSubmit(e, updateItem)}
                    >
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
                        label="Name"
                        id="title"
                        size="lg"
                        name="title"
                        defaultValue={item.title}
                        placeholder="Title"
                        handleChange={this.handleChange}
                      />
                      <InputField
                        label="Description"
                        type="textarea"
                        id="description"
                        rows={6}
                        size="lg"
                        defaultValue={item.description}
                        name="description"
                        placeholder="Description"
                        handleChange={this.handleChange}
                      />
                      <InputField
                        label="Price"
                        id="price"
                        size="lg"
                        defaultValue={String(item.price)}
                        type="number"
                        name="price"
                        placeholder="Price"
                        handleChange={this.handleChange}
                      />
                      <Button type="submit" color="primary">
                        {loadingMutation ? 'Updating...' : 'Update'}
                      </Button>
                    </Form>
                  </CardBody>
                </Card>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

UpdateItem.propTypes = {
  id: PropTypes.string.isRequired,
};

export default UpdateItem;
