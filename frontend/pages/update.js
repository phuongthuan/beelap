import PropTypes from 'prop-types';
import UpdateItem from '../components/UpdateItem';
import PleaseSignIn from '../components/PleaseSignIn';
import AdminSideBar from '../components/AdminSideBar';

const Update = ({ query }) => (
  <PleaseSignIn>
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminSideBar />
        </div>
        <div className="col-md-10">
          <UpdateItem id={query.id} />
        </div>
      </div>
    </div>
  </PleaseSignIn>
);

Update.propTypes = {
  query: PropTypes.object.isRequired,
};
export default Update;
