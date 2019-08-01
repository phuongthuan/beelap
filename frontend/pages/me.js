import Profile from '../components/Profile';
import PleaseSignIn from '../components/PleaseSignIn';

const Me = () => (
  <div className="container">
    <PleaseSignIn>
      <Profile />
    </PleaseSignIn>
  </div>
);

export default Me;
