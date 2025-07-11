const propertyIsIncluded = require('./propertyIsIncluded');

function getMissingRequiredFields(data, requiredFields) {
  const missingRequiredFields = [];

  for (field of requiredFields) {
    if (propertyIsIncluded(data, field)) {
      missingRequiredFields.push(field);
    }
  }

  return missingRequiredFields;
}

module.exports = getMissingRequiredFields;
