import React from 'react';
import Link from 'next/link';
import { Card, Icon } from 'antd';

import DeleteItem from './DeleteItem';
import theme from '../lib/theme';
import { CardWrapper } from './styles/CardStyles';

const { Meta } = Card;

const Item = ({ item }) => (
  <CardWrapper
    bordered={false}
    bodyStyle={{ paddingBottom: 0 }}
    style={{ fontSize: '12px' }}
    cover={
      item.image ? (
        <img alt={item.title} src={item.image} />
      ) : (
        <img alt="Not available" src="/static/noimage.jpg" />
      )
    }
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
  </CardWrapper>
);

export default Item;
