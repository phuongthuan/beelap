import React from 'react';
import { Query } from 'react-apollo';
import Link from 'next/link';
import SidebarStyles from './styles/SidebarStyles';
import { ALL_CATEGORIES_QUERY } from './Category';

const Sidebar = () => (
  <SidebarStyles>
    <Query query={ALL_CATEGORIES_QUERY}>
      {({ data }) => {
        if (data.categories) {
          return (
            <>
              {data.categories.map(cat => (
                <Link
                  key={cat.id}
                  href={{
                    pathname: '/items/category',
                    query: {
                      id: cat.id,
                    },
                  }}
                >
                  <li>{cat.name}</li>
                </Link>
              ))}
            </>
          );
        }
      }}
    </Query>
  </SidebarStyles>
);

export default Sidebar;
