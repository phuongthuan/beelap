/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Card, CardBody, Button, Alert, Input } from 'reactstrap';

import InputField from './InputField';

import ErrorMessage from './ErrorMessage';
import { ALL_ITEMS_QUERY } from './Items';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`;

class CreateItem extends Component {
  state = {
    isLoadingImage: false,
    title: '',
    description: '',
    price: '',
    image: '',
    largeImage: '',
    errors: [],
  };

  handleChange = (value, name) => {
    console.log(name, value);
    this.setState({ [name]: value });
  };

  handleSubmit = async (e, createItemMutation) => {
    e.preventDefault();
    const { title, description, price, image, largeImage } = this.state;

    await createItemMutation({
      variables: {
        title,
        description,
        price: Number(price),
        image,
        largeImage,
      },
    });

    Router.push({
      pathname: '/',
    });
  };

  uploadFile = async e => {
    const { files } = e.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'beelap');
    this.setState({ isLoadingImage: true });

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/thuannp/image/upload',
      {
        method: 'POST',
        body: data,
      }
    );

    if (res) {
      const result = await res.json();
      this.setState({
        image: result.secure_url,
        largeImage: result.eager[0].secure_url,
        isLoadingImage: false,
      });
    }
  };

  showImage = () => {
    const { image, isLoadingImage } = this.state;
    if (isLoadingImage) {
      return <div>Loading...</div>;
    }
    if (image) {
      return (
        <div>
          <img width="60%" src={image} alt="item" />
        </div>
      );
    }
    return null;
  };

  render() {
    const { title, description, price, errors } = this.state;
    return (
      <div>
        <Mutation
          mutation={CREATE_ITEM_MUTATION}
          refetchQueries={[{ query: ALL_ITEMS_QUERY }]}
        >
          {(createItem, { loading, error }) => {
            if (error) return <ErrorMessage message={error.message} />;
            return (
              <Card className="mx-auto" style={{ maxWidth: '450px' }}>
                <CardBody>
                  <h2 className="text-center pb-3">Create New Item</h2>
                  <Form
                    method="POST"
                    onSubmit={e => this.handleSubmit(e, createItem)}
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
                      value={title}
                      handleChange={this.handleChange}
                    />
                    <InputField
                      label="Description"
                      type="textarea"
                      id="description"
                      rows={6}
                      size="lg"
                      value={description}
                      name="description"
                      handleChange={this.handleChange}
                    />
                    <InputField
                      label="Price"
                      id="price"
                      size="lg"
                      value={price}
                      type="number"
                      name="price"
                      handleChange={this.handleChange}
                    />
                    <Input
                      id="file"
                      type="file"
                      name="file"
                      onChange={this.uploadFile}
                    />
                    {this.showImage()}
                    <Button type="submit" color="primary">
                      {loading ? 'Creating...' : 'Create'}
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
