import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';

import ErrorMessage from '../../components/ErrorMessage';
import Item from '../../components/Item';
import SideBar from '../../components/Sidebar';
import ItemNotFound from '../../components/styles/ItemNoFound';

const ALL_ITEMS_BY_CATEGORY = gql`
  query ALL_ITEMS_BY_CATEGORY($category: String) {
    items(category: $category) {
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

const Category = ({ query }) => (
  <>
    <Head>
      <title>Beelap - Category {query.id}</title>
    </Head>
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <SideBar />
        </div>
        <Query query={ALL_ITEMS_BY_CATEGORY} variables={{ category: query.id }}>
          {({ data, loading, error }) => {
            if (loading) return <p>Loading...</p>;

            if (error) return <ErrorMessage message={error.message} />;

            if (data.items.length === 0)
              return <ItemNotFound>No Item found!</ItemNotFound>;

            return (
              <div className="col-md-10">
                <div className="row">
                  {data.items.map(item => (
                    <div
                      key={item.id}
                      className="col-lg-3 col-md-4 col-sm-6 p-4"
                    >
                      <Item item={item} />
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    </div>
  </>
);

Category.propTypes = {
  query: PropTypes.object.isRequired,
};

export default Category;
