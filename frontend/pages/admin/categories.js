import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import AdminSideBar from '../../components/AdminSideBar';
import PleaseSignIn from '../../components/PleaseSignIn';

export default class Categories extends Component {
  static propTypes = {};

  render() {
    return (
      <PleaseSignIn>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <AdminSideBar />
            </div>
          </div>
        </div>
      </PleaseSignIn>
    );
  }
}
