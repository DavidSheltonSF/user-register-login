const express = require('express');
const dotenv = require('dotenv')
const MysqlConnector = require('./repositories/helper/MysqlConnector');
const register = require('./routes/register');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const login = require('./routes/login');
const findById = require('./routes/findById');
const cookieJwtAuth = require('./middlewares/cookieJwtAuth');
const upload = require('./middlewares/upload');
const me = require('./routes/me');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT;

// These shold be put at the top to avoid error
app.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'pages')));
app.use(express.static( path.join(__dirname, '..', '..', 'frontend')));

app.use(
  cors({
    origin: 'http://56.124.32.168:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

(async () => {
  const mysqlConnector = MysqlConnector.getInstance();
  await mysqlConnector.connect();

  app.get('/me', cookieJwtAuth, me);
  app.post('/login', login);
  app.post('/register', upload.single('profile_picture'), register);
  app.get('/user/:id', cookieJwtAuth, findById);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
})();
