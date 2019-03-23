import styled from 'styled-components';

const PriceTag = styled.span`
  background: ${props => props.theme.onyx};
  transform: rotate(3deg);
  color: ${props => props.theme.yellow};
  font-weight: 600;
  padding: 5px;
  line-height: 1;
  font-size: 2rem;
  display: inline-block;
  position: absolute;
  top: -3px;
  right: -3px;
`;

export default PriceTag;
