import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Item from './Item';
import ErrorMessage from './ErrorMessage';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
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

class Items extends Component {
  render() {
    return (
      <Query query={ALL_ITEMS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <ErrorMessage message={error.message} />;
          return (
            <div className="row">
              {data.items.map(item => (
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
