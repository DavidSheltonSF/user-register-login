class MissingBodyError extends Error {
  constructor() {
    super(`Missing body request`);
    this.name = 'MissingBodyError';
  }
}

module.exports = MissingBodyError;
