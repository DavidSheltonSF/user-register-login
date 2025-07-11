function propertyIsIncluded(obj, property) {
  const isMissing = !Object.keys(obj).includes(property);
  return isMissing;
}

module.exports = propertyIsIncluded;
