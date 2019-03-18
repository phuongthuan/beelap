import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;

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

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UpdateItem extends Component {
  handleSubmit = (e, updateItemMutation) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await updateItemMutation({
          variables: {
            id: this.props.id,
            ...values,
            price: Number(values.price),
          },
        });

        console.log('Updated');
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = this.props.form;
    const { id } = this.props;
    const itemTitleError = isFieldTouched('title') && getFieldError('title');
    const itemPriceError = isFieldTouched('price') && getFieldError('price');
    const itemDescriptionError =
      isFieldTouched('description') && getFieldError('description');
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>{error.message}</div>;
          if (!data.item) return <p>No item found for ID {id}</p>;
          const { item } = data;
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION}>
              {(updateItem, { loadingMutation, error }) => (
                <Form
                  layout="horizontal"
                  onSubmit={e => this.handleSubmit(e, updateItem)}
                >
                  <Form.Item
                    validateStatus={itemTitleError ? 'error' : ''}
                    help={itemTitleError || ''}
                  >
                    {getFieldDecorator('title', {
                      initialValue: item.title,
                      rules: [
                        { required: true, message: 'Please input title!' },
                      ],
                    })(<Input placeholder="Title" />)}
                  </Form.Item>
                  <Form.Item
                    validateStatus={itemDescriptionError ? 'error' : ''}
                    help={itemDescriptionError || ''}
                  >
                    {getFieldDecorator('description', {
                      initialValue: item.description,
                      rules: [
                        {
                          required: true,
                          message: 'Please input description!',
                        },
                      ],
                    })(<TextArea placeholder="Description" rows={4} />)}
                  </Form.Item>
                  <Form.Item
                    validateStatus={itemPriceError ? 'error' : ''}
                    help={itemPriceError || ''}
                  >
                    {getFieldDecorator('price', {
                      initialValue: item.price,
                      rules: [
                        { required: true, message: 'Please input price!' },
                      ],
                    })(<Input placeholder="Price" />)}
                  </Form.Item>

                  <Form.Item>
                    <Button
                      loading={loadingMutation}
                      type="primary"
                      htmlType="submit"
                      disabled={hasErrors(getFieldsError())}
                    >
                      Update
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

const WrappedUpdateItem = Form.create({ name: 'updateItem_form' })(UpdateItem);
export default WrappedUpdateItem;
