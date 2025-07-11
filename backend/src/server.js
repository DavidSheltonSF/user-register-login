const express = require('express');
const MysqlConnector = require('./repositories/helper/MysqlConnector');
const register = require('./routes/register');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const login = require('./routes/login');
const findById = require('./routes/findById');
const cookieJwtAuth = require('./middlewares/cookieJwtAuth');
const upload = require('./middlewares/upload');
const me = require('./routes/me');

const app = express();
const port = 3000;

app.use(
  cors({
    origin: 'http://localhost:5500',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

(async () => {
  const mysqlConnector = MysqlConnector.getInstance();
  await mysqlConnector.connect();

  app.get('/', (req, res) => {
    res.send('Eae bro? Bora finalizar esse projeto?');
  });

  app.get('/me', cookieJwtAuth, me);
  app.post('/login', login);
  app.post('/register', upload.single('profile_picture'), register);
  app.get('/user/:id', cookieJwtAuth, findById);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
