const UserController = require('../controllers/UserController');

async function register(req, res) {
  try {
    const userController = new UserController();
    const response = await userController.create(req);

    res.status(response.status).send(response);
  } catch (error) {
    res.status(500).send({
      status: 500,
      error: 'ServerError',
      message: 'Something went wrong inside the server',
    });
  }
}

module.exports = register;
