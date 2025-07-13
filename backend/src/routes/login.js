const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserController = require('../controllers/UserController');
const BcryptHelper = require('../services/helpers/BcryptHelper');
const {
  unauthorized,
  serverError,
  badRequest,
  notFound,
  forbidden,
} = require('../controllers/http/http-helpers');
const MissingBodyError = require('../controllers/errors/MissingBodyError');
const MissingFieldsError = require('../controllers/errors/MissingFieldsError');
const {
  isMissingFieldsError,
  isMissingBodyError,
  isNotFoundError,
  isInvalidPasswordError,
} = require('./helpers/error-hepers');

dotenv.config();

async function login(req, res) {
  try {
    const userController = new UserController();

    const response = await userController.login(req);

    const { token } = response.data;

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true se usar HTTPS
      path: '/',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    res.status(response.status).send(response);
  } catch (error) {
    console.log(error);

    if (isMissingBodyError(error) || isMissingFieldsError(error)) {
      return res.status(400).send(badRequest(error.message));
    }

    if (isNotFoundError(error)) {
      return res.status(404).send(notFound(error.message));
    }

    if (isInvalidPasswordError(error)) {
      return res.status(403).send(forbidden(error.message));
    }

    res.status(500).send(serverError());
  }
}

module.exports = login;
