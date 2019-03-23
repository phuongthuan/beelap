import styled from 'styled-components';

const ItemStyles = styled.div`
  background: white;
  box-shadow: ${props => props.theme.bs};
  position: relative;
  display: flex;
  flex-direction: column;
  img {
    width: 100%;
  }
  p {
    font-size: 12px;
    line-height: 2;
    font-weight: 300;
    flex-grow: 1;
    padding: 8px 3rem;
    font-size: 1.5rem;
  }
  .buttonList {
    display: flex;
    width: 100%;
    border-top: 1px solid ${props => props.theme.onyx};
    justify-content: space-between;
    & > * {
      cursor: pointer;
      background: white;
      border: 0;
      font-size: 1rem;
      padding: 1rem;
    }
  }
`;

export default ItemStyles;
