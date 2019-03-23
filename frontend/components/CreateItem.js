/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Alert } from 'reactstrap';

import BeeButton from './styles/BeeButton';
import Form from './styles/Form';
import { validate } from '../lib/utils';

import ErrorMessage from './ErrorMessage';
import { ALL_ITEMS_QUERY } from './Items';
import Category from './Category';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $category: CategoryCreateOneInput
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      category: $category
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
      title
      category {
        id
        name
      }
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
    category: '',
    description: '',
    price: '',
    image: '',
    largeImage: '',
    errors: [],
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e, createItemMutation) => {
    e.preventDefault();
    const {
      title,
      category,
      description,
      price,
      image,
      largeImage,
    } = this.state;

    const errors = validate(this.state);

    if (errors.length > 0) {
      this.setState({ errors });
      return;
    }

    await createItemMutation({
      variables: {
        title,
        category: {
          connect: { id: category },
        },
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
    const { title, category, description, price, errors } = this.state;
    return (
      <div>
        <Mutation
          mutation={CREATE_ITEM_MUTATION}
          refetchQueries={[{ query: ALL_ITEMS_QUERY }]}
        >
          {(createItem, { loading, error }) => {
            if (error) return <ErrorMessage message={error.message} />;
            return (
              <Form
                width="500px"
                className="mt-5"
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
                <h2 className="text-center pb-3">Create New Item</h2>
                <label htmlFor="Title">
                  Title
                  <input
                    id="title"
                    name="title"
                    value={title}
                    onChange={this.handleChange}
                  />
                </label>

                {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                <label htmlFor="cagtegory">
                  Category
                  <select
                    style={{ height: '26.42px' }}
                    id="category"
                    name="category"
                    value={category}
                    onChange={this.handleChange}
                  >
                    <option>Select...</option>
                    <Category>
                      {({ data, loadingCate, error }) => {
                        if (loadingCate) return <p>Loading...</p>;
                        if (!data.categories) return null;

                        return data.categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ));
                      }}
                    </Category>
                  </select>
                </label>
                <label htmlFor="Description">
                  Description
                  <input
                    type="textarea"
                    id="description"
                    rows={6}
                    value={description}
                    name="description"
                    onChange={this.handleChange}
                  />
                </label>
                <label htmlFor="Price">
                  Price
                  <input
                    id="price"
                    value={price}
                    type="number"
                    name="price"
                    onChange={this.handleChange}
                  />
                </label>
                <label htmlFor="File">
                  Image
                  <input
                    id="file"
                    type="file"
                    name="file"
                    onChange={this.uploadFile}
                  />
                </label>
                {this.showImage()}
                <BeeButton type="submit" className="mt-3">
                  {loading ? 'Creating...' : 'Create'}
                </BeeButton>
              </Form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
