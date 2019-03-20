export function validate(name, email, password) {
  const errors = [];
  if (name.length === 0) {
    errors.push('Please enter name');
  }

  if (email.length === 0) {
    errors.push('Please enter email');
  }

  if (password.length === 0) {
    errors.push('Please enter password');
  }

  if (password.length < 5) {
    errors.push('Password should be at least 6 characters');
  }

  return errors;
}
