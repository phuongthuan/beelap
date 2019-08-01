import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Table } from 'reactstrap';
import { Query } from 'react-apollo';
import { ALL_ITEMS_QUERY } from '../../components/Items';
import ErrorMessage from '../../components/ErrorMessage';
import PleaseSignIn from '../../components/PleaseSignIn';
import AdminSideBar from '../../components/AdminSideBar';
import AdminSingleItem from '../../components/AdminSingleItem';

export default class Items extends Component {
  static propTypes = {};

  render() {
    return (
      <PleaseSignIn>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <AdminSideBar />
            </div>
            <div className="col-md-10">
              <Query query={ALL_ITEMS_QUERY}>
                {({ data, loading, error }) => {
                  if (loading) return <p>Loading...</p>;
                  if (error) return <ErrorMessage message={error.message} />;

                  // console.log(data);

                  return (
                    <div className="row">
                      <Table>
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Item Id</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Image</th>
                            <th>Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.items.map((item, index) => (
                            <AdminSingleItem
                              index={index}
                              key={item.id}
                              item={item}
                            />
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  );
                }}
              </Query>
            </div>
          </div>
        </div>
      </PleaseSignIn>
    );
  }
}
