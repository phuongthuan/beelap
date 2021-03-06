import React, { Component } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Alert } from 'reactstrap';

import ErrorMessage from './ErrorMessage';
import Category from './Category';
import BeeButton from './styles/BeeButton';
import Form from './styles/Form';
import Loading from './Loading';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(id: $id) {
      id
      title
      image
      largeImage
      category {
        id
        name
      }
      description
      price
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $category: CategoryCreateOneInput
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      category: $category
      description: $description
      price: $price
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

class UpdateItem extends Component {
  state = {
    errors: [],
  };

  handleChange = e => {
    const { name, value } = e.target;
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
    const { category } = this.state;
    delete this.state.errors;
    const categoryUpdate = category ? { connect: { id: category } } : null;

    const updatedItem = await updateItemMutation({
      variables: {
        ...this.state,
        id: this.props.id,
        category: categoryUpdate,
      },
    });

    if (updatedItem) {
      Router.push('/');
    }
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
    if (isLoadingImage) return <Loading />;

    if (image) {
      return (
        <div>
          <img width="50%" src={image} alt="item" />
        </div>
      );
    }
    return null;
  };

  render() {
    const { errors } = this.state;
    const { id } = this.props;
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading) return <Loading />;

          if (error) return <div>{error.message}</div>;

          if (!data.item) return <p>No item found for ID {id}</p>;

          const { item } = data;

          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loadingMutation, error }) => (
                <Form
                  width="500px"
                  className="mt-5"
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
                  <h2 className="text-center pb-3">Update Item</h2>
                  <label htmlFor="Title">
                    Title
                    <input
                      id="title"
                      name="title"
                      defaultValue={item.title}
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
                      defaultValue={item.category.id}
                      onChange={this.handleChange}
                    >
                      <option>Select...</option>
                      <Category>
                        {({ data: { categories }, loadingCate }) => {
                          if (loadingCate) return <p>Loading...</p>;
                          return categories.map(cat => (
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
                    <textarea
                      id="description"
                      rows={7}
                      defaultValue={item.description}
                      name="description"
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
                  <img width="50%" src={item.image} alt="item" />

                  <label htmlFor="Price">
                    Price
                    <input
                      id="price"
                      defaultValue={item.price}
                      type="number"
                      name="price"
                      onChange={this.handleChange}
                    />
                  </label>
                  <BeeButton type="submit" className="mt-3">
                    {loadingMutation ? 'Updating...' : 'Update'}
                  </BeeButton>
                </Form>
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
export { SINGLE_ITEM_QUERY };
