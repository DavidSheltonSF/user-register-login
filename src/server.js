const express = require('express');
const UserRepository = require('./repositories/UserRepository');
const MysqlHelper = require('./repositories/helper/MysqlHelper');
const app = express();
const port = 3000;

app.use(express.json());

(async () => {
  const mysqlHelper = MysqlHelper.create();
  await mysqlHelper.connect();

  app.get('/', (req, res) => {
    res.send('Eae bro? Bora finalizar esse projeto?');
  });

  app.post('/register', async (req, res) => {
    const { username, password, email, phone } = req.body;
    const userRepository = new UserRepository();
    const registredUser = await userRepository.add({
      username,
      password,
      email,
      phone,
    });

    res.status(200).send({
      body: registredUser
    });
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
})();
