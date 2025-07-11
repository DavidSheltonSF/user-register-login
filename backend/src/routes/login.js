const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserController = require('../controllers/UserController');
const BcryptHelper = require('../services/helpers/BcryptHelper');
const {
  unauthorized,
  serverError,
} = require('../controllers/http/http-helpers');

dotenv.config();

async function login(req, res) {
  try {
    const userController = new UserController();
    const { email, password } = req.body;

    const response = await userController.findByEmail(req);

    if (response.status === 404) {
      return res.status(response.status).send(response);
    }

    const user = response.data;

    const equalPassword = await BcryptHelper.compare(password, user.password);

    if (!equalPassword) {
      return res
        .status(401)
        .send(unauthorized('The password provided is wrong'));
    }

    delete user.password;

    const token = jwt.sign(user, process.env.MY_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // true se usar HTTPS
      path: '/',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    res.status(200).send({
      user: user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(serverError());
  }
}

module.exports = login;
