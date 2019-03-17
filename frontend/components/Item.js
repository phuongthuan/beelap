import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import Button from './Button';
import theme from '../lib/theme';

const ItemWrapper = styled.div`
  border-radius: 0;
  margin-bottom: 1em;
`;

const ItemTitle = styled.div`
  cursor: pointer;
  text-decoration: underline;
  font-weight: bold;
`;

const Item = ({ item }) => (
  <ItemWrapper className="card">
    <div className="card-body">
      <Link
        href={{
          pathname: 'item',
          query: { id: item.id },
        }}
      >
        <ItemTitle className="card-title">{item.title}</ItemTitle>
      </Link>
      <div className="card-text">{item.description}</div>
      <div className="card-text">{item.price}</div>
      <Link
        href={{
          pathname: 'update',
          query: { id: item.id },
        }}
      >
        <Button bgcolor={theme.Onyx}>Edit</Button>
      </Link>
      <Button textcolor={theme.Onyx} bgcolor={theme.Yellow_Orange}>
        Add to card
      </Button>
      <Button bgcolor={theme.Rufous}>Delete</Button>
    </div>
    <div>{item.image && <img src={item.image} alt={item.title} />}</div>
  </ItemWrapper>
);

export default Item;
