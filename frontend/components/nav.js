import Link from 'next/link';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';
import Router from 'next/router';
import styled from 'styled-components';

import { Icon } from 'antd';
import { BadgeWrapper } from './styles/BadgeStyles';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const NavWrapper = styled.ul`
  padding-top: 15px;
  li {
    a {
      color: ${props => props.theme.Onyx};
    }
  }
`;

const Nav = ({ className }) => (
  <NavWrapper className={`${className} nav justify-content-end`}>
    <li className="nav-item">
      <Link href="/">
        <a className="nav-link">Shop</a>
      </Link>
    </li>
    <li className="nav-item">
      <Link href="/sell">
        <a className="nav-link">Sell</a>
      </Link>
    </li>
    <li className="nav-item">
      <Link href="/orders">
        <a className="nav-link">Orders</a>
      </Link>
    </li>
    <li className="nav-item">
      <Link href="/signin">
        <a className="nav-link">Signin</a>
      </Link>
    </li>
    <li className="nav-item">
      <Link href="/signup">
        <a className="nav-link">Signup</a>
      </Link>
    </li>
    <li className="nav-item">
      <a className="nav-link">
        <BadgeWrapper count={5}>
          <Icon style={{ fontSize: '27px' }} type="shopping-cart" />
        </BadgeWrapper>
      </a>
    </li>
  </NavWrapper>
);

Nav.propTypes = {
  className: PropTypes.string,
};

export default Nav;
