class NotOwnerError extends Error {
  constructor() {
    super(`NotOwnerError: User not owns this resource`);
    this.name = 'NotOwnerError';
  }
}

module.exports = NotOwnerError;
