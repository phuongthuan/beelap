import React from 'react';
import PropTypes from 'prop-types';
import PleaseSignIn from '../components/PleaseSignIn';
import Order from '../components/Order';

const OrderPage = ({ query }) => (
  <PleaseSignIn>
    <Order id={query.id} />
  </PleaseSignIn>
);

OrderPage.propTypes = {
  query: PropTypes.object.isRequired,
};

export default OrderPage;
