const UserController = require('../controllers/UserController');

async function findById(req, res) {
  try {
    const userController = new UserController();
    const response = await userController.findById(req);

    if (response && response.error) {
      res.status(response.status).send({
        status: response.status,
        error: response.error,
        message: response.message,
      });
      return;
    }

    res.status(response.status).send({
      body: response.body,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      status: 500,
      error: 'ServerError',
      message: 'Something went wrong inside the server'
    })
  }
}

module.exports = findById;