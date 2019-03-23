export function validate(data) {
  const errors = [];
  if (data.name === '') {
    errors.push('Please enter name');
  }

  if (data.email === '') {
    errors.push('Please enter email');
  }

  if (data.password === '') {
    errors.push('Please enter password');
  }

  if (data.title === '') {
    errors.push('Please enter title');
  }

  if (data.description === '') {
    errors.push('Please enter desciption');
  }

  if (data.price === '') {
    errors.push('Please enter price');
  }

  return errors;
}
