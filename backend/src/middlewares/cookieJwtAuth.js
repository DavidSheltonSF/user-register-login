const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function cookieJwtAuth(req, res, next) {
  try {
    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.MY_SECRET);

    req.authUser = decoded;

    next();
  } catch (err) {
    console.log(err);

    res.status(401).send({
      status: 401,
      error: 'InvalidTokenError',
      message: 'Token is invalid, you need to authenticate',
    });
  }
}

module.exports = cookieJwtAuth;
