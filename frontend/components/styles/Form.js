import styled from 'styled-components';

const Form = styled.form`
  margin: 0 auto;
  border-radius: 0;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  border: 5px solid white;
  padding: 20px;
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 600;
  width: ${props => (props.width ? props.width : '350px')};
  h2 {
    text-transform: uppercase;
  }
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid ${props => props.theme.onyx};
    &:focus {
      outline: 0;
      border-color: ${props => props.theme.red};
    }
  }
  button,
  input[type='submit'] {
    width: auto;
    background: ${props => props.theme.onyx};
    color: ${props => props.theme.yellow};
    border: 0;
    font-size: 2rem;
    font-weight: 600;
    padding: 0.5rem 1.2rem;
  }
  a {
    display: block;
    font-size: 1rem;
    padding-bottom: 5px;
    color: ${props => props.theme.onyx};
  }
`;

export default Form;
