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
} = require('./http/http-helpers');

class UserController {
  service = new UserService();

  async findById(request) {
    try {
      const { id } = request.params;
      const { authUser } = request;

      if (!authUser) {
        return {
          status: 403,
          error: 'Forbidden',
          message: 'You are not authenticated',
        };
      }

      if (!id) {
        return {
          status: 400,
          error: 'MissingIdError',
          message: 'Id is missing',
        };
      }

      const user = await this.service.findById(Number(id), authUser.id);

      const userBirthday = user.profile.birthday;
      const formatedBirthday = userBirthday.toISOString().split('T')[0];

      return {
        status: 200,
        body: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          profile: {
            id: 1,
            birthday: formatedBirthday,
            profile_picture: user.profile.profile_picture,
          },
        },
      };
    } catch (err) {
      console.log(err);

      if (err instanceof NotOwnerError) {
        return {
          status: 403,
          error: 'Forbidden',
          message: 'You do not have permission to acces this resource',
        };
      }
    }
  }

  async findByEmail(request) {
    const { email } = request.body;

    if (!email) {
      return {
        status: 400,
        error: 'MissingEmailError',
        message: 'Email field is missing',
      };
    }

    const response = this.service.findByEmail(email);

    return response;
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
