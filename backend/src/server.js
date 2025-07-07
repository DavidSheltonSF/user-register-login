const express = require('express');
const MysqlHelper = require('./repositories/helper/MysqlHelper');
const register = require('./routes/register');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const login = require('./routes/login');
const findById = require('./routes/findById');
const cookieJwtAuth = require('./middlewares/cookieJwtAuth');
const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());
app.use(cookieParser());

(async () => {
  const mysqlHelper = MysqlHelper.create();
  await mysqlHelper.connect();

  app.get('/', (req, res) => {
    res.send('Eae bro? Bora finalizar esse projeto?');
  });

  app.post('/login', login);
  app.post('/register', register);
  app.get('/user/:id', cookieJwtAuth, findById);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
