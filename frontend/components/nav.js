import Link from 'next/link';
import { Mutation } from 'react-apollo';

import User from './User';
import NavStyles from './styles/NavStyles';
import Signout from './Signout';
import { TOGGLE_CART_MUTATION } from './Cart';
import CartCount from './CartCount';
import hasPermission from '../lib/hasPermission';

const Nav = () => (
  <User>
    {({ data }) => {
      const me = data ? data.me : null;
      return (
        <NavStyles>
          <Link href="/items">
            <a>Product</a>
          </Link>
          {me && (
            <>
              {hasPermission(me, ['ADMIN', 'PERMISSIONCREATE']).length !==
                0 && (
                <Link href="/sell">
                  <a>Sell</a>
                </Link>
              )}

              <Link href="/orders">
                <a>My Orders</a>
              </Link>
              <Link href="/me">
                <a>Account</a>
              </Link>
              <Signout />
              <Mutation mutation={TOGGLE_CART_MUTATION}>
                {toggleCart => {
                  const cartCount = me.cart.reduce(
                    (tally, cartItem) => tally + cartItem.quantity,
                    0
                  );

                  return (
                    <button onClick={toggleCart}>
                      My Cart
                      {cartCount === 0 ? null : <CartCount count={cartCount} />}
                    </button>
                  );
                }}
              </Mutation>
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
