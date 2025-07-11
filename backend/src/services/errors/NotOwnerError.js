class NotOwnerError extends Error {
  constructor() {
    super(`NotOwnerError: User does not own this resource.`);
    this.name = 'NotOwnerError';
  }
}

module.exports = NotOwnerError;
