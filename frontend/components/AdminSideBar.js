import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import SidebarStyles from './styles/SidebarStyles';

export default class AdminSideBar extends Component {
  static propTypes = {};

  render() {
    return (
      <SidebarStyles>
        <Link href="/admin/items">
          <li>Item Management</li>
        </Link>
        <Link href="/admin/categories">
          <li>Category Management</li>
        </Link>
        <Link href="/admin/permissions">
          <li>Permissions Management</li>
        </Link>
      </SidebarStyles>
    );
  }
}
