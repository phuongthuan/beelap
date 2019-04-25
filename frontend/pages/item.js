import PropTypes from 'prop-types';
import SingleItem from '../components/SingleItem';
import SideBar from '../components/Sidebar';

const Item = ({ query }) => (
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-2">
        <SideBar />
      </div>
      <div className="col-md-10">
        <SingleItem id={query.id} />
      </div>
    </div>
  </div>
);

Item.propTypes = {
  query: PropTypes.object.isRequired,
};

export default Item;
