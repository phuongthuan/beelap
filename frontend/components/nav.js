import Link from 'next/link';
import User from './User';
import NavStyles from './styles/NavStyles';

const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null;
      return (
        <NavStyles>
          <Link href="/">
            <a>Shop</a>
          </Link>
          <Link href="/items">
            <a>Product</a>
          </Link>
          {me && (
            <>
              <Link href="/sell">
                <a>Sell</a>
              </Link>
              <Link href="/orders">
                <a>My Orders</a>
              </Link>
              <Link href="/me">
                <a>Account</a>
              </Link>
            </>
          )}
          {!me && (
            <Link href="/signin">
              <a>Signin</a>
            </Link>
          )}
        </NavStyles>
      );
    }}
  </User>
);

export default Nav;
