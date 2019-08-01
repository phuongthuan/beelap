import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Link from 'next/link';
import Head from 'next/head';
import PropTypes from 'prop-types';

import PaginationStyles from './styles/PaginationStyles';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return <Loading />;
      if (error) return <ErrorMessage />;

      const { count } = data.itemsConnection.aggregate;

      const pages = Math.ceil(count / perPage);

      const { page } = props;

      return (
        <PaginationStyles>
          <Head>
            <title>
              Beelap — Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page - 1 },
            }}
          >
            <a className="prev" aria-disabled={page <= 1}>
              ← Prev
            </a>
          </Link>
          <p>
            Page {props.page} of <span className="totalPages">{pages}</span>
          </p>
          <p>{count} products</p>
          <Link
            prefetch
            href={{
              pathname: 'items',
              query: { page: page + 1 },
            }}
          >
            <a className="next" aria-disabled={page >= pages}>
              Next →
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
};

export default Pagination;
