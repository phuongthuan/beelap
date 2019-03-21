import Link from 'next/link';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';
import Router from 'next/router';
import { Nav as NavReactstrap, NavItem, NavLink } from 'reactstrap';

import User from './User';
import ErrorMessage from './ErrorMessage';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const Nav = ({ className }) => (
  <NavReactstrap pills className={`${className} pt-4 justify-content-end`}>
    <NavItem active>
      <Link href="/">
        <NavLink>
          <u>Shop</u>
        </NavLink>
      </Link>
    </NavItem>
    <NavItem>
      <Link href="/sell">
        <NavLink>Sell</NavLink>
      </Link>
    </NavItem>
    <NavItem>
      <Link href="/orders">
        <NavLink>Orders</NavLink>
      </Link>
    </NavItem>
    <User>
      {({ data: { me }, loading, error }) => {
        if (loading) return <div>Loading...</div>;
        if (error) return <ErrorMessage message={error.message} />;
        if (me) return <a className="nav-link">{me.name}</a>;
        return (
          <>
            <NavItem>
              <Link href="/signin">
                <NavLink>Signin</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link href="/signup">
                <NavLink>Signup</NavLink>
              </Link>
            </NavItem>
          </>
        );
      }}
    </User>
  </NavReactstrap>
);

Nav.propTypes = {
  className: PropTypes.string,
};

export default Nav;
