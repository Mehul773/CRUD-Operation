const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");

const validate = require("./src/middleware/validation");
const jwtStrategy = require("./src/config/passport");
const auth = require("./src/middleware/auth");
const {
  creatUser,
  login,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
} = require("./src/controller/userController");

dotenv.config();
const app = express();

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Middleware for passport
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

//Apis
app.post("/user", validate("create"), creatUser);

app.post("/login", login);

app.get("/users", auth(), getAllUser);

app.get("/user/:id", auth(), getUser);

app.put("/user/:id", validate("update"), auth(), updateUser);

app.delete("/user/:id", auth(), deleteUser);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connecetd..."))
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((e) => console.log(e));
