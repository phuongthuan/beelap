import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Icon, Popconfirm, message } from 'antd';

import { ALL_ITEMS_QUERY } from './Items';
import theme from '../lib/theme';

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

function confirm(e, deleteItemMutation) {
  deleteItemMutation();
  message.success('Delete Item Success');
}

export default class DeleteItem extends Component {
  update = (cache, payload) => {
    // manually update the cache on the client, so it matches the server
    // 1. Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log(data, payload);
    // 2. Filter the deleted itemout of the page
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    );
    // 3. Put the items back!
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data });
  };

  render() {
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
      >
        {deleteItem => (
          <Popconfirm
            title="Are you sure delete this task?"
            onConfirm={e => confirm(e, deleteItem)}
            okText="Yes"
            cancelText="No"
          >
            <a>
              <Icon
                style={{ fontSize: 20, color: theme.Rufous }}
                type="delete"
              />
            </a>
          </Popconfirm>
        )}
      </Mutation>
    );
  }
}
