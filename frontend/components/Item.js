import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Card, CardBody, Button, ButtonGroup } from 'reactstrap';

import DeleteItem from './DeleteItem';

const Item = ({ item }) => (
  <Card>
    <CardBody>
      <img width="100%" src={item.image} alt={item.title} />
      <Link
        href={{
          pathname: 'item',
          query: { id: item.id },
        }}
      >
        <h2>{item.title}</h2>
      </Link>

      <p className="text-danger">${item.price}</p>

      <p className="font-weight-light">{item.description}</p>

      <ButtonGroup>
        <Button>Card</Button>
        <Link
          href={{
            pathname: 'update',
            query: { id: item.id },
          }}
        >
          <Button>Edit</Button>
        </Link>
        <DeleteItem id={item.id} />
      </ButtonGroup>
    </CardBody>
  </Card>
);

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Item;
