const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserController = require('../controllers/UserController');

dotenv.config();

async function login(req, res) {
  const userController = new UserController();
  const { email, password } = req.body;

  const user = await userController.findByEmail(req);

  if (!user) {
    res.status(401).send({
      status: 401,
      error: 'Unauthorized',
      message: 'The user with the email provided was not found',
    });
  }

  console.log(password);
  console.log(user.password);

  if (password !== user.password) {
    res.status(401).send({
      status: 401,
      error: 'Unauthorized',
      message: 'The password provided is wrong',
    });
  }

  delete user.password;

  const token = jwt.sign(user, process.env.MY_SECRET, { expiresIn: '1min' });

  res.cookie('token', token);

  res.status(200).send({
    user: user,
    token,
  });
}

module.exports = login;
