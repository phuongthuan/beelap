import React from 'react';
import Link from 'next/link';
import { Card, Icon } from 'antd';

import DeleteItem from './DeleteItem';
import theme from '../lib/theme';

const { Meta } = Card;

const Item = ({ item }) => (
  <Card
    bodyStyle={{ paddingTop: 0, paddingBottom: '10px' }}
    cover={item.image ? <img alt={item.title} src={item.image} /> : null}
    actions={[
      <Icon
        style={{ fontSize: 20, color: theme.Dark_Gunmetal }}
        type="shopping-cart"
      />,
      // Edit Button
      <Link
        href={{
          pathname: 'update',
          query: { id: item.id },
        }}
      >
        <Icon
          style={{ fontSize: 20, color: theme.Yellow_Orange }}
          type="edit"
        />
      </Link>,
      <DeleteItem id={item.id} />,
    ]}
  >
    <Meta
      title={
        <Link
          href={{
            pathname: 'item',
            query: { id: item.id },
          }}
        >
          <a>{item.title}</a>
        </Link>
      }
      description={
        <div>
          <h1 style={{ color: theme.Rufous }}>${item.price}</h1>
          <p>{item.description}</p>
        </div>
      }
    />
  </Card>
);

export default Item;
