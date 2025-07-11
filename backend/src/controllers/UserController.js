const DuplicatedEmailError = require('../services/errors/DuplicatedEmailError');
const NotFoundError = require('../services/errors/NotFoundError');
const NotOwnerError = require('../services/errors/NotOwnerError');
const UserService = require('../services/UserService');
const getMissingRequiredFields = require('./helpers/getMissingRequiredFields');
const {
  badRequest,
  ok,
  unprocessableEntity,
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
    try {
      const { email } = request.body;

      if (!email) {
        return badRequest('Missing email');
      }

      const user = await this.service.findByEmail(email);

      return ok(user);
    } catch (err) {
      console.log(err);

      if (err instanceof NotFoundError) {
        return notFound(err.message);
      }

      return serverError();
    }
  }

  async create(request) {
    try {
      const { body } = request;

      if (!body) {
        return badRequest('Missing body request');
      }

      const { username, password, email, phone, birthday } = body;

      const requiredFields = ['username', 'password', 'email'];

      const missingRequiredFields = getMissingRequiredFields(
        body,
        requiredFields
      );

      if (missingRequiredFields.length > 0) {
        return badRequest(
          `Missing required params: ${[missingRequiredFields]}`
        );
      }

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
    } catch (error) {
      if (error instanceof DuplicatedEmailError) {
        return unprocessableEntity(
          `A user is already associated with the email ${email}.`
        );
      }

      if (error instanceof NotFoundError) {
        return notFound(`User not found`);
      }

      if (error instanceof NotOwnerError) {
        return forbidden(`User does not own the requested resource.`);
      }

      return serverError();
    }
  }
}

module.exports = UserController;
