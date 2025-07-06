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
      const { username, password, email, phone, birthday, profile_picture } =
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
        profile_picture,
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
}

module.exports = UserController;
