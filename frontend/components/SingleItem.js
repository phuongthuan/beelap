import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Query } from 'react-apollo';

import SingleItemStyles from './styles/SingleItemStyles';
import { SINGLE_ITEM_QUERY } from './UpdateItem';
import ErrorMessage from './ErrorMessage';
import ItemNotFound from './styles/ItemNoFound';
import AddToCart from './AddToCart';
import User from './User';

const SingleItem = props => (
  <Query query={SINGLE_ITEM_QUERY} variables={{ id: props.id }}>
    {({ data, loading, error }) => {
      if (loading) return <p>Loading...</p>;

      if (error) return <ErrorMessage message={error.message} />;

      if (!data.item)
        return <ItemNotFound>No Item Found for {props.id}</ItemNotFound>;
      const { item } = data;

      return (
        <SingleItemStyles>
          <Head>
            <title>Beelap | {item.title}</title>
          </Head>
          {item.image && <img src={item.image} alt={item.title} />}
          <div className="details">
            <h1 className="mb-4">{item.title}</h1>
            <p>{item.description}</p>
            <h3>${item.price}</h3>

            <User>
              {/* eslint-disable-next-line no-shadow */}
              {({ data }) => {
                const me = data ? data.me : null;
                console.log(data);
                // if (me) {
                //   return <AddToCart id={props.id} />;
                // }

                return null;
              }}
            </User>
          </div>
        </SingleItemStyles>
      );
    }}
  </Query>
);

SingleItem.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SingleItem;
