const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserController = require('../controllers/UserController');
const BcryptHelper = require('../services/helpers/BcryptHelper');

dotenv.config();

async function login(req, res) {
  try {
    const userController = new UserController();
    const { email, password } = req.body;

    const user = await userController.findByEmail(req);

    if (!user) {
      return res.status(401).send({
        status: 401,
        error: 'Unauthorized',
        message: 'The user with the email provided was not found',
      });
    }

    const equalPassword = await BcryptHelper.compare(password, user.password);

    if (!equalPassword) {
      return res.status(401).send({
        status: 401,
        error: 'Unauthorized',
        message: 'The password provided is wrong',
      });
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
    res.status(500).send({
      status: 500,
      error: 'Server Error',
      message: 'Something went wrong in server side',
    });
  }
}

module.exports = login;
