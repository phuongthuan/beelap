import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      name
      email
      permissions
      cart {
        id
        quantity
        item {
          id
          price
          image
          title
          description
        }
      }
    }
  }
`;

const User = props => (
  <Query query={CURRENT_USER_QUERY} {...props}>
    {payload => props.children(payload)}
  </Query>
);

User.propTypes = {
  children: PropTypes.func.isRequired,
};

export default User;
export { CURRENT_USER_QUERY };
