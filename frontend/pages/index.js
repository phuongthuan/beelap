import Items from '../components/Items';
import SideBar from '../components/Sidebar';

const Home = props => (
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-2">
        <SideBar />
      </div>
      <div className="col-md-10">
        {/* eslint-disable-next-line react/prop-types */}
        <Items page={parseFloat(props.query.page) || 1} />
      </div>
    </div>
  </div>
);

export default Home;
