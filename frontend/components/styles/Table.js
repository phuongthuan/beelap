import styled from 'styled-components';

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
  box-shadow: ${props => props.theme.bs};
  /* border: 1px solid ${props => props.theme.offWhite}; */
  thead {
    font-size: 10px;
  }
  td,
  th {
    border-bottom: 1px solid ${props => props.theme.offWhite};
    font-size: 1em;
    padding: 15px;
    position: relative;
    &:last-child {
      border-right: none;
      width: 150px;
      button {
        width: 100%;
      }
    }
    label {
      padding: 10px 5px;
      display: block;
    }
  }
  tr {
    padding: 10px;
    &:hover {
      background: ${props => props.theme.offWhite};
    }
  }
`;

export default Table;
