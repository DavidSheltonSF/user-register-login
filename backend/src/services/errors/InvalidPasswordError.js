class InvalidPasswordError extends Error {
  constructor(message = 'The password is incorrect') {
    super(message);
    this.name = 'InvalidPasswordError';
  }
}

module.exports = InvalidPasswordError;
