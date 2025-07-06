const express = require('express');
const MysqlHelper = require('./repositories/helper/MysqlHelper');
const UserController = require('./controllers/UserController');
const register = require('./routes/register');
const app = express();
const port = 3000;

app.use(express.json());

(async () => {
  const mysqlHelper = MysqlHelper.create();
  await mysqlHelper.connect();

  app.get('/', (req, res) => {
    res.send('Eae bro? Bora finalizar esse projeto?');
  });

  app.post('/register', register);

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
