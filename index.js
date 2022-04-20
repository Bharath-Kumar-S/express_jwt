const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/usermodel");
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb://localhost:27017/jwt-mern-user")
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log(err));

app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.listen(5000);

app.use(express.json());

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create(req.body);
    res.status(201).send({status: 'OK',token:user});
  } catch (error) {
    res.status(404).send({ error: "Duplicate email" });
  }
});

app.get("/api/quote", async (req, res) => {
  const token = req.headers['x-access-tokem'];

    const decoded = jwt.verify(
      token,
      process.env.jwrSecret
    );

  try {
    const user = await User.create(req.body);
    res.status(201).send({ status: "OK", token: user });
  } catch (error) {
    res.status(404).send({ error: "Duplicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  //   console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
      password: password,
    });
    if (user) {
      const token = jwt.sign(
        {
          name: user.name,
          email: user.email,
        },
        process.env.jwrSecret
      );
      res.json({ status: "OK", user: token }).status(200);
    }
    else{
    res.json({ status: "error", user: false }).status(404);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
