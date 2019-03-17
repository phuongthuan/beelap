import styled from 'styled-components';
import { Button as RButton } from 'reactstrap';

const ButtonWrapper = styled(RButton)`
  color: ${props => props.textcolor};
  background-color: ${props => props.bgcolor};
  border-color: ${props => props.bgcolor};
  border-radius: 0;

  &:hover {
    color: ${props => props.textcolor};
    background-color: ${props => props.bgcolor};
    border-color: ${props => props.bgcolor};
  }
  &:focus {
    outline: none;
    border-color: none;
    box-shadow: none;
  }
`;

const Button = ({
  type,
  id,
  name,
  className,
  style,
  size,
  children,
  ...rest
}) => (
  <ButtonWrapper
    className={className}
    style={style}
    id={id}
    name={name}
    type={type}
    size={size}
    {...rest}
  >
    {children}
  </ButtonWrapper>
);

export default Button;
