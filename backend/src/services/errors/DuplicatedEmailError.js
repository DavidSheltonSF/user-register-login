class DuplicatedEmailError extends Error {
  constructor(email) {
    super(
      `DuplicatedEmailError: the email "${email}" is already associated to a user`
    );
    this.name = 'DuplicatedEmailError';
  }
}

module.exports = DuplicatedEmailError;
