import Link from 'next/link';
import NProgress from 'nprogress';
import Router from 'next/router';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const Nav = ({ className }) => (
  <ul className={`${className} nav`}>
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
        <a className="nav-link">My Orders</a>
      </Link>
    </li>
    <li className="nav-item">
      <Link href="/signin">
        <a className="nav-link">SignIn</a>
      </Link>
    </li>
  </ul>
);

export default Nav;
