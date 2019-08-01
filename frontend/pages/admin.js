// import Link from 'next/link';
import AdminSideBar from '../components/AdminSideBar';
import PleaseSignIn from '../components/PleaseSignIn';

const Admin = () => (
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

export default Admin;
