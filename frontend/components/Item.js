import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import DeleteItem from './DeleteItem';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import AddToCart from './AddToCart';
import User from './User';
import hasPermission from '../lib/hasPermission';

const Item = ({ item }) => (
  <ItemStyles>
    {item.image && <img src={item.image} alt={item.title} />}
    <Title>
      <Link
        href={{
          pathname: '/item',
          query: { id: item.id },
        }}
      >
        <a>{item.title}</a>
      </Link>
    </Title>

    <PriceTag>${item.price}</PriceTag>

    <p>{item.description}</p>

    <User>
      {({ data }) => {
        const me = data ? data.me : null;
        return (
          <>
            {me && (
              <div className="buttonList">
                {hasPermission(me, ['ADMIN', 'PERMISSIONUPDATE']).length !==
                  0 && (
                  <Link
                    href={{
                      pathname: 'update',
                      query: { id: item.id },
                    }}
                  >
                    <a>✏️Edit</a>
                  </Link>
                )}
                <AddToCart id={item.id} />
                {hasPermission(me, ['ADMIN', 'PERMISSIONDELETE']).length !==
                  0 && <DeleteItem id={item.id}>❌Delete</DeleteItem>}
              </div>
            )}
          </>
        );
      }}
    </User>
  </ItemStyles>
);

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Item;
