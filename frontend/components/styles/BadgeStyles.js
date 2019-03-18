import styled from 'styled-components';
import { Badge } from 'antd';

import theme from '../../lib/theme';

export const BadgeWrapper = styled(Badge)`
  .ant-badge-count {
    background-color: ${theme.Yellow_Orange};
  }
`;
