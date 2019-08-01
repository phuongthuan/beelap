import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Item from './Item';
import ErrorMessage from './ErrorMessage';
import Pagination from './Pagination';
import { perPage } from '../config';
import Loading from './Loading';

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY ($skip: Int = 0, $first: Int = ${perPage}) {
    items (first: $first, skip: $skip) {
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
  static propTypes = {
    page: PropTypes.number,
  };

  render() {
    return (
      <div className="text-center">
        <Query
          query={ALL_ITEMS_QUERY}
          variables={{
            skip: this.props.page * perPage - perPage,
          }}
        >
          {({ data, loading, error }) => {
            if (loading) return <Loading />;

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
        <Pagination page={this.props.page} />
      </div>
    );
  }
}

export default Items;
export { ALL_ITEMS_QUERY };
