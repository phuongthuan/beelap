import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Icon, Input, Button, Modal } from 'antd';

import ErrorMessage from './ErrorMessage';
import { UploadWrapper } from './styles/UploadStyles';

const { TextArea } = Input;

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
      createdAt
      updatedAt
    }
  }
`;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CreateItem extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
    image: '',
    largeImage: '',
  };

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList });
  };

  handleSubmit = (e, createItemMutation) => {
    e.preventDefault();
    const { image, largeImage } = this.state;
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await createItemMutation({
          variables: {
            ...values,
            image,
            largeImage,
            price: Number(values.price),
          },
        });

        Router.push({
          pathname: '/',
        });
      }
    });
  };

  uploadFile = async ({ onProgress, onSuccess, onError, file }) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'beelap');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/thuannp/image/upload',
      {
        method: 'POST',
        body: data,
      }
    );

    if (res) {
      const result = await res.json();
      onProgress({ percent: res ? 100 : 1 }, file);
      onSuccess(null, file);
      this.setState({
        image: result.secure_url,
        largeImage: result.eager[0].secure_url,
      });
    } else {
      onError();
    }
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched,
    } = this.props.form;

    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const itemTitleError = isFieldTouched('title') && getFieldError('title');
    const itemPriceError = isFieldTouched('price') && getFieldError('price');
    const itemDescriptionError =
      isFieldTouched('description') && getFieldError('description');
    return (
      <div>
        <Mutation mutation={CREATE_ITEM_MUTATION}>
          {(createItem, { loading, error }) => {
            if (error) return <ErrorMessage message={error.message} />;
            return (
              <Form
                layout="horizontal"
                onSubmit={e => this.handleSubmit(e, createItem)}
              >
                <Form.Item
                  validateStatus={itemTitleError ? 'error' : ''}
                  help={itemTitleError || ''}
                >
                  {getFieldDecorator('title', {
                    rules: [{ required: true, message: 'Please input title!' }],
                  })(<Input size="large" placeholder="Title" />)}
                </Form.Item>
                <Form.Item
                  validateStatus={itemDescriptionError ? 'error' : ''}
                  help={itemDescriptionError || ''}
                >
                  {getFieldDecorator('description', {
                    rules: [
                      { required: true, message: 'Please input description!' },
                    ],
                  })(
                    <TextArea size="large" placeholder="Description" rows={7} />
                  )}
                </Form.Item>
                <Form.Item
                  validateStatus={itemPriceError ? 'error' : ''}
                  help={itemPriceError || ''}
                >
                  {getFieldDecorator('price', {
                    rules: [{ required: true, message: 'Please input price!' }],
                  })(<Input size="large" placeholder="Price" />)}
                </Form.Item>
                <Form.Item>
                  <Input size="large" placeholder="Large Image" />
                </Form.Item>

                <div>
                  <UploadWrapper
                    size="large"
                    customRequest={e => this.uploadFile(e)}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 3 ? null : uploadButton}
                  </UploadWrapper>
                  <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                  >
                    <img
                      alt="example"
                      style={{ width: '100%' }}
                      src={previewImage}
                    />
                  </Modal>
                </div>

                <Form.Item>
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    disabled={hasErrors(getFieldsError())}
                    icon="form"
                  >
                    Create
                  </Button>
                </Form.Item>
              </Form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

const WrappedCreateItem = Form.create({ name: 'createItem_form' })(CreateItem);
export default WrappedCreateItem;
export { CREATE_ITEM_MUTATION };
