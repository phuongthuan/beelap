import React from 'react';
import Permissions from '../../components/Permissions';
import AdminSideBar from '../../components/AdminSideBar';
import PleaseSignIn from '../../components/PleaseSignIn';

const PermissionsPage = () => (
  <PleaseSignIn>
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminSideBar />
        </div>
        <div className="col-md-10">
          <Permissions />
        </div>
      </div>
    </div>
  </PleaseSignIn>
);

export default PermissionsPage;
