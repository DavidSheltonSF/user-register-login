class MissingFieldsError extends Error {
  constructor(fields) {
    super(`Missing required field(s) ${fields.join(', ')}`);
    this.name = 'MissingFieldsError';
  }
}

module.exports = MissingFieldsError;
