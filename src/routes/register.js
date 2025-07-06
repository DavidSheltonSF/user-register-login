const UserController = require('../controllers/UserController');

async function register(req, res) {
  const userController = new UserController();
  const response = await userController.create(req);

  res.status(response.status).send({
    body: response.body,
  });
}

module.exports = register