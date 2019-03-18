import styled from 'styled-components';
import { Card } from 'antd';

export const CardWrapper = styled(Card)`
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  .ant-card-actions > li:not(:last-child) {
    border: none;
  }
  .ant-card-actions {
    border: none;
  }
`;
