class DuplicatedEmailError extends Error {
  constructor(email) {
    super(
      `DuplicatedEmailError: The email "${email}" is already associated with a user.`
    );
    this.name = 'DuplicatedEmailError';
  }
}

module.exports = DuplicatedEmailError;
