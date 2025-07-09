const NotOwnerError = require('../services/errors/NotOwnerError');
const UserService = require('../services/UserService');

class UserController {
  service = new UserService();

  async create(httpRequest) {
    const { body } = httpRequest;

    if (!body) {
      return {
        status: 400,
        error: 'MissingFieldsError',
        message: 'Body is missing in request',
      };
    }

    try {

      const file = httpRequest.file

      const { username, password, email, phone, birthday } =
        body;

      const requiredFields = ['username', 'password', 'email'];

      for (let i = 0; i < requiredFields.length; i++) {
        if (!Object.keys(body).includes(requiredFields[i])) {
          return {
            status: 400,
            message: 'One or more required fields are missing in body request',
          };
        }
      }
      
      const response = await this.service.create({
        username,
        password,
        email,
        phone,
        birthday,
        profile_picture: file ? file.location : undefined,
      });

      return {
        status: 200,
        body: response,
      };
    } catch (err) {
      return {
        status: 400,
        error: err.name,
        message: err.message,
      };
    }
  }

  async findById(httpRequest) {
    try {
      const { id } = httpRequest.params;
      const { authUser } = httpRequest;

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

  async findByEmail(httpRequest) {
    const { email } = httpRequest.body;

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
}

module.exports = UserController;
