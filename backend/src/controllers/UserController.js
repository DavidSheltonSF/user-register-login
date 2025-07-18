const DuplicatedEmailError = require('../services/errors/DuplicatedEmailError');
const NotFoundError = require('../services/errors/NotFoundError');
const NotOwnerError = require('../services/errors/NotOwnerError');
const UserService = require('../services/UserService');
const validateRequiredFields = require('./helpers/validateRequiredFields');
const validateBodyExistance = require('./helpers/vlidateBodyExistance');
const {
  badRequest,
  ok,
  notFound,
  forbidden,
  serverError,
  unauthorized,
} = require('./http/http-helpers');

class UserController {
  service = new UserService();

  async findById(request) {
    try {
      const { id } = request.params;
      const { authUser } = request;

      if (!authUser) {
        return unauthorized('User not authenticated');
      }

      if (!id) {
        return badRequest('Missing id');
      }

      const user = await this.service.findById(Number(id), authUser.id);

      return ok(user);
    } catch (err) {
      console.log(err);

      if (err instanceof NotOwnerError) {
        return forbidden(err.message);
      }

      if (err instanceof NotFoundError) {
        return notFound(err.message);
      }

      return serverError();
    }
  }

  async findByEmail(request) {
    const body = request.body;

    validateBodyExistance(body);
    validateRequiredFields(body, ['email']);

    const user = await this.service.findByEmail(email);

    return user;
  }

  async create(request) {
    const { body } = request;

    validateBodyExistance(body);

    const requiredFields = ['username', 'password', 'email'];
    validateRequiredFields(body, requiredFields);

    const { username, password, email, phone, birthday } = body;

    const file = request.file;

    const response = await this.service.create({
      username,
      password,
      email,
      phone,
      birthday,
      profile_picture: file ? file.location : undefined,
    });

    return ok(response);
  }

  async login(request) {
    const body = request.body;

    validateBodyExistance(body);
    validateRequiredFields(body, ['email', 'password']);

    const { email, password } = body;

    console.log(email)
    const { user, token } = await this.service.login(email, password);

    return ok({
      user,
      token,
    });
  }
}

module.exports = UserController;
