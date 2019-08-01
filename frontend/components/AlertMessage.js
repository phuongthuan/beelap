import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';

const AlertStyles = styled.div`
  background: green;
  padding: 1em;
  width: auto;
  position: fixed;
  bottom: 0;
  right: 0;
  color: ${props => props.theme.lightgrey};
  ${props => (props.open ? '' : `display: none;`)};
  transform: skew(-2deg);

  button {
    display: none;
  }
`;

const LOCAL_STATE_QUERY = gql`
  query {
    alertMessage @client
    alertOpen @client
  }
`;

const WRITE_ALERT_MESSAGE = gql`
  mutation WRITE_ALERT_MESSAGE($message: String!) {
    writeAlertMessage(message: $message) @client
  }
`;

const HIDE_ALERT_MESSAGE = gql`
  mutation HIDE_ALERT_MESSAGE {
    hideAlertMessage @client
  }
`;

class AlertMessage extends React.Component {
  render() {
    return (
      <Query query={LOCAL_STATE_QUERY}>
        {({ data }) => (
          <AlertStyles open={data.alertOpen}>
            {data.alertMessage}
            <Mutation mutation={HIDE_ALERT_MESSAGE}>
              {hideAlertMessage => (
                <button onClick={hideAlertMessage}>x</button>
              )}
            </Mutation>
          </AlertStyles>
        )}
      </Query>
    );
  }
}

export default AlertMessage;
export { HIDE_ALERT_MESSAGE, WRITE_ALERT_MESSAGE };
