import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Item from './Item';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
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

export default class Items extends Component {
  render() {
    return (
      <div className="row d-flex flex-column">
        <Query query={ALL_ITEMS_QUERY}>
          {(data, loading, error) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>{error.message}</div>;

            const {
              data: { items },
            } = data;

            console.log('items', items);

            return items.map(item => <Item key={item.id} item={item} />);
          }}
        </Query>
      </div>
    );
  }
}
