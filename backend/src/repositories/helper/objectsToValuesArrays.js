function objectsToValuesArrays(objects) {
  const arrays = objects.map((obj) => Object.values(obj));

  return arrays;
}

module.exports = objectsToValuesArrays;
