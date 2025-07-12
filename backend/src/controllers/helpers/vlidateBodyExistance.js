const MissingBodyError = require("../errors/MissingBodyError");

function validateBodyExistance(body) {
  if (!body) {
    throw new MissingBodyError();
  }
}

module.exports = validateBodyExistance;
