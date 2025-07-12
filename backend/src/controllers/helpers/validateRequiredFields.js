const MissingFieldsError = require('../errors/MissingFieldsError');
const getMissingRequiredFields = require('./getMissingRequiredFields');

function validateRequiredFields(body, requiredFields) {
  const missingRequiredFields = getMissingRequiredFields(body, requiredFields);
  console.log('validate')
  console.log(missingRequiredFields);
  if (missingRequiredFields.length > 0) {
    throw new MissingFieldsError(missingRequiredFields);
  }

}

module.exports = validateRequiredFields;
