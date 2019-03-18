import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Spin } from 'antd';

import Item from './Item';
import ErrorMessage from './ErrorMessage';

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

class Items extends Component {
  render() {
    return (
      <Query query={ALL_ITEMS_QUERY}>
        {(data, loading, error) => {
          if (loading) return <Spin />;
          if (error) return <ErrorMessage message={error.message} />;

          const {
            data: { items },
          } = data;

          return (
            <div className="row">
              {items.map(item => (
                <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 p-4">
                  <Item item={item} />
                </div>
              ))}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Items;
export { ALL_ITEMS_QUERY };
