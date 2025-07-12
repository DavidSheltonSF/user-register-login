const MissingBodyError = require('../controllers/errors/MissingBodyError');
const MissingFieldsError = require('../controllers/errors/MissingFieldsError');
const {
  serverError,
  badRequest,
  unprocessableEntity,
} = require('../controllers/http/http-helpers');
const UserController = require('../controllers/UserController');
const DuplicatedEmailError = require('../services/errors/DuplicatedEmailError');

async function register(req, res) {
  try {
    const userController = new UserController();
    const response = await userController.create(req);

    res.status(response.status).send(response);
  } catch (error) {
    console.log(error);
    if (error instanceof MissingBodyError) {
      return res.status(400).send(badRequest(error.message));
    }

    if (error instanceof MissingFieldsError) {
      return res.status(400).send(badRequest(error.message));
    }

    if (error instanceof DuplicatedEmailError) {
      return res.status(422).send(unprocessableEntity(error.message));
    }

    res.status(500).send(serverError());
  }
}

module.exports = register;
