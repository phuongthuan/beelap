import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';

const AdminSingleItem = ({ item, index }) => (
  <>
    <Head>
      <title>My items</title>
    </Head>
    <tr>
      <td>{index + 1}</td>
      <td>
        <Link
          href={{
            pathname: '/update',
            query: { id: item.id },
          }}
        >
          <a>{item.id}</a>
        </Link>
      </td>
      <td>{item.title}</td>
      <td>
        {item.description.length > 20
          ? `${item.description.substr(0, 20)}...`
          : item.description}
      </td>
      <td>
        <img width="50" src={item.image} alt="item url" />
      </td>
      <td>${item.price}</td>
    </tr>
  </>
);

AdminSingleItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

export default AdminSingleItem;
