import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import Head from 'next/head';
import Link from 'next/link';

const OrderItem = ({ order }) => (
  <>
    <Head>
      <title>My Orders</title>
    </Head>
    <tr>
      <td>
        <Link
          href={{
            pathname: '/order',
            query: { id: order.id },
          }}
        >
          <a>{order.id}</a>
        </Link>
      </td>
      <td>{format(order.createdAt, 'MMMM d, YYYY h:mm a')}</td>
      <td>
        {order.items.length > 1 ? (
          <span>
            {order.items[0].title} and {order.items.length} items
          </span>
        ) : (
          <span>{order.items[0].title}</span>
        )}
      </td>
      <td>${order.total}</td>
    </tr>
  </>
);

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderItem;
