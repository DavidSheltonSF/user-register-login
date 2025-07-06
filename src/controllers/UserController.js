const UserService = require('../services/UserService');

class UserController {
  service = new UserService();

  async create(httpRequest) {
    const { body } = httpRequest;

    if (!body) {
      return {
        status: 400,
        message: 'Bad Request',
      };
    }

    const { username, password, email, phone, birthday, profile_picture } = body;

    const requiredFields = ['username', 'password', 'email'];

    for (let i =0; i < requiredFields.length; i++){
      if(!Object.keys(body).includes(requiredFields[i])){
        return {
          status: 400,
          message: 'Bad Request',
        };
      }
    }


    const response = await this.service.createUser({
      username,
      password,
      email,
      phone,
      birthday,
      profile_picture
    });

    return {
      status: 200,
      body: response,
    };
  }
}

module.exports = UserController;
