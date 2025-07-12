const MissingFieldsError = require('../errors/MissingFieldsError');
const getMissingRequiredFields = require('./getMissingRequiredFields');

function validateRequiredFields(body, requiredFields) {
  const missingRequiredFields = getMissingRequiredFields(body, requiredFields);
  if (missingRequiredFields.length > 0) {
    throw new MissingFieldsError(missingRequiredFields);
  }
}

module.exports = validateRequiredFields;
