import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const ALL_CATEGORIES_QUERY = gql`
  query ALL_CATEGORIES_QUERY {
    categories {
      id
      name
      description
    }
  }
`;
const Category = props => (
  <Query query={ALL_CATEGORIES_QUERY} {...props}>
    {payload => props.children(payload)}
  </Query>
);

Category.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Category;
export { ALL_CATEGORIES_QUERY };
