import styled from 'styled-components';

const SidebarStyles = styled.ul`
  font-size: 1.5rem;
  margin: 0;
  padding: 0;

  li {
    background-color: ${props => props.theme.lightgray};
    border-bottom: 2px solid ${props => props.theme.orange};
    transform: skew(-10deg);
    list-style: none;
    font-weight: 900;
    cursor: pointer;
  }
  a,
  button {
    font-weight: 900;
    text-transform: uppercase;
    border-radius: 0;
    padding: 0 3rem;
    font-weight: 800;
    box-shadow: ${props => props.theme.bs};
  }
`;

export default SidebarStyles;
