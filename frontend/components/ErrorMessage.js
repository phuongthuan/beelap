import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'reactstrap';

const ErrorMessage = ({ message }) => <Alert color="danger">{message}</Alert>;

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
