import React from 'react';
import { FormGroup, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';

class InputField extends React.Component {
  handleChange = e => {
    const { handleChange } = this.props;
    const { value, name } = e.target;
    handleChange(value, name);
  };

  render() {
    const {
      id,
      type,
      name,
      value,
      style,
      label,
      size,
      placeholder,
      className,
    } = this.props;

    return (
      <FormGroup>
        {label && <Label for={id}>{label}</Label>}
        <Input
          id={id}
          name={name}
          value={value}
          onChange={this.handleChange}
          type={type}
          style={style}
          bsSize={size}
          placeholder={placeholder}
          className={className}
        />
      </FormGroup>
    );
  }
}

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  style: PropTypes.object,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
};

export default InputField;
