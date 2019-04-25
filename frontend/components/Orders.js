import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from './ErrorMessage';
import OrderItem from './OrderItem';
import Table from './styles/Table';

const ALL_ORDERS_QUERY = gql`
  query ALL_ORDERS_QUERY {
    orders {
      id
      items {
        id
        title
        description
        price
        image
      }
      charge
      total
      user {
        id
        name
        email
      }
      createdAt
    }
  }
`;

class Orders extends Component {
  render() {
    return (
      <Query query={ALL_ORDERS_QUERY}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <ErrorMessage message={error.message} />;

          return (
            <div className="row">
              <Table>
                <thead>
                  <tr>
                    <th>Order Id</th>
                    <th>Bought Date</th>
                    <th>Items Name</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map(order => (
                    <OrderItem key={order.id} order={order} />
                  ))}
                </tbody>
              </Table>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Orders;
export { ALL_ORDERS_QUERY };
