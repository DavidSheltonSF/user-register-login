const express = require('express')
const UserRepository = require('./repositories/UserRepository')
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Eae bro? Bora finalizar esse projeto?");
});

app.post("/register", async (req, res) => {
  const { username, password, email, phone } = req.body;
  const userRepository = new UserRepository();
  const userId = await userRepository.add({
    username,
    password,
    email,
    phone
  })

  console.log(userId)
  res.status(200).send({
    userId,
    username,
    password,
    email,
    phone
  })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})