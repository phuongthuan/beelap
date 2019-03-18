import React from 'react';
import { Alert } from 'antd';

const ErrorMessage = ({ message }) => (
  <Alert message="Error" description={message} type="error" showIcon />
);

export default ErrorMessage;
