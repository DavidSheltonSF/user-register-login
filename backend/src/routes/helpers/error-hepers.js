const MissingBodyError = require('../../controllers/errors/MissingBodyError');
const MissingFieldsError = require('../../controllers/errors/MissingFieldsError');
const InvalidPasswordError = require('../../services/errors/InvalidPasswordError');
const NotFoundError = require('../../services/errors/NotFoundError');

function isMissingBodyError(error) {
  return error instanceof MissingBodyError;
}

function isMissingFieldsError(error) {
  return error instanceof MissingFieldsError;
}

function isNotFoundError(error) {
  return error instanceof NotFoundError;
}

function isInvalidPasswordError(error) {
  return error instanceof InvalidPasswordError;
}

module.exports = {
  isMissingBodyError,
  isMissingFieldsError,
  isNotFoundError,
  isInvalidPasswordError,
};
