const { serverError } = require('../controllers/http/http-helpers');
const UserController = require('../controllers/UserController');

async function findById(req, res) {
  try {
    const userController = new UserController();
    const response = await userController.findById(req);

    res.status(response.status).send(response);

  } catch (error) {
    console.log(error)
    res.status(500).send(serverError());
  }
}

module.exports = findById;