import Items from '../components/Items';
import SideBar from '../components/Sidebar';

const Home = () => (
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-2">
        <SideBar />
      </div>
      <div className="col-md-10">
        <Items />
      </div>
    </div>
  </div>
);

export default Home;
