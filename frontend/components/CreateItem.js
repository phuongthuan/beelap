import React, { Component } from 'react';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Form, Icon, Input, Button, Upload, Modal } from 'antd';
import ErrorMessage from './ErrorMessage';

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
                  })(<Input placeholder="Title" />)}
                </Form.Item>
                <Form.Item
                  validateStatus={itemDescriptionError ? 'error' : ''}
                  help={itemDescriptionError || ''}
                >
                  {getFieldDecorator('description', {
                    rules: [
                      { required: true, message: 'Please input description!' },
                    ],
                  })(<TextArea placeholder="Description" rows={4} />)}
                </Form.Item>
                <Form.Item
                  validateStatus={itemPriceError ? 'error' : ''}
                  help={itemPriceError || ''}
                >
                  {getFieldDecorator('price', {
                    rules: [{ required: true, message: 'Please input price!' }],
                  })(<Input placeholder="Price" />)}
                </Form.Item>
                <Form.Item>
                  <Input placeholder="Large Image" />
                </Form.Item>

                <div className="clearfix">
                  <Upload
                    customRequest={e => this.uploadFile(e)}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                  >
                    {fileList.length >= 3 ? null : uploadButton}
                  </Upload>
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
                  >
                    Create
                  </Button>
                </Form.Item>
              </Form>
            );
          }}
        </Mutation>
        <style jsx>{`
          .ant-upload-select-picture-card i {
            font-size: 50px;
            color: #999;
          }

          .ant-upload-select-picture-card .ant-upload-text {
            margin-top: 8px;
            color: #666;
          }
        `}</style>
      </div>
    );
  }
}

const WrappedCreateItem = Form.create({ name: 'createItem_form' })(CreateItem);
export default WrappedCreateItem;
export { CREATE_ITEM_MUTATION };
