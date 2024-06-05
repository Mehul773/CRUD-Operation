const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: Number,
  address: String,
});

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    }
  } catch (error) {
    console.log("From userModel", error);
    next(error);
  }
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = await jwt.sign({ _id: this._id }, "mySecret", {
      expiresIn: "20 hours",
    });
    return token;
  } catch (error) {
    console.log("From userModel", error);
    return res.status(500).json(error);
  }
};

userSchema.plugin(mongoosePaginate);

const userModel = mongoose.model("UserModel", userSchema);

module.exports = userModel;
