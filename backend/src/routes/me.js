const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserController = require('../controllers/UserController');

dotenv.config();

async function me(req, res) {
  try {
    const userController = new UserController();
    const token = req.cookies.token;

    if (!token) {
      res.status(400).send('No toke was provided');
    }

    const decoded = jwt.decode(token, process.env.MY_SECRET);

    req.params = {
      id: decoded.id,
    };

    const response = await userController.findById(req);

    if (response.error) {
      return res.status(response.status).send({
        status: response.status,
        error: response.error,
        message: response.message,
      });
    }

    res.status(200).send({
      status: 200,
      body: {
        userId: response.body.id,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = me;
