class NotFoundError extends Error {
  constructor(message) {
    super(
      `NotFoundError: ${message}`
    );
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
