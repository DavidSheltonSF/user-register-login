const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserController = require('../controllers/UserController');
const { serverError, ok } = require('../controllers/http/http-helpers');

dotenv.config();

async function me(req, res) {
  try {
    const userController = new UserController();
    const token = req.cookies.token;

    if (!token) {
      res.status(400).send('No token was provided');
    }

    const decoded = jwt.decode(token, process.env.MY_SECRET);

    req.params = {
      id: decoded.id,
    };

    const response = await userController.findById(req);

    if (response.status >= 400) {
      return res.status(response.status).send(response);
    }

    res.status(200).send(
      ok({
        userId: response.data.id,
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).send(serverError());
  }
}

module.exports = me;
