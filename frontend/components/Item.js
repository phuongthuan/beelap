import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import DeleteItem from './DeleteItem';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import AddToCart from './AddToCart';

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

    <div className="buttonList">
      <Link
        href={{
          pathname: 'update',
          query: { id: item.id },
        }}
      >
        <a>Edit</a>
      </Link>
      <AddToCart />
      <DeleteItem id={item.id}>Delete</DeleteItem>
    </div>
  </ItemStyles>
);

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Item;
