import React from 'react';
import Link from 'next/link';
import NProgress from 'nprogress';
import Router from 'next/router';
import {
  Nav as NavReactstrap,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import User from './User';
import ErrorMessage from './ErrorMessage';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

class Nav extends React.Component {
  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    return (
      <div>
        <NavReactstrap>
          <NavItem>
            <Link href="/">
              <NavLink className="pl-0">BEELAP</NavLink>
            </Link>
          </NavItem>

          <NavItem>
            <Link href="/sell">
              <NavLink>SELL</NavLink>
            </Link>
          </NavItem>

          <User>
            {({ data: { me }, loading, error }) => {
              if (loading) return <div>Loading...</div>;

              if (error) return <ErrorMessage message={error.message} />;

              if (me)
                return (
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      ACCOUNT
                    </DropdownToggle>
                    <DropdownMenu right>
                      <Link href="/profile">
                        <DropdownItem>{me.name}</DropdownItem>
                      </Link>
                      <Link href="/orders">
                        <DropdownItem>MyOrders</DropdownItem>
                      </Link>
                      <DropdownItem divider />
                      <DropdownItem>Signout</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                );

              return (
                <>
                  <NavItem>
                    <Link href="/signin">
                      <NavLink>SIGNIN</NavLink>
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link href="/signup">
                      <NavLink>SIGNUP</NavLink>
                    </Link>
                  </NavItem>
                </>
              );
            }}
          </User>
        </NavReactstrap>
      </div>
    );
  }
}

export default Nav;
