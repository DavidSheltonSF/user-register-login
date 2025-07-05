const express = require('express')
const app = express();
const port = 3000;

app.use(express.json());
app.use()

app.get("/", (req, res) => {
  res.send("Eae bro? Bora finalizar esse projeto?");
});

app.post("/register", (req, res) => {
  const {name, birthday, profile_picture} = req.body;

  res.status(200).send({
    name,
    birthday,
    profile_picture
  })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})