const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

const creatUser = async (req, res) => {
  try {
    const user = await userModel.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.log("From userController.js", error);
    return res.status(500).json(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      console.log("From userController.js.....\n User not found");
      return res.status(404).json({ Message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ Message: "Password is not valid" });
    }
    const token = await user.generateAuthToken();
    return res.status(200).json(token);
  } catch (error) {
    console.log("From userController.js", error);
    return res.status(500).json(error.message);
  }
};

const getAllUser = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const options = {
      page: page,
      limit: limit,
      select: ('-password'),
      sort: ('name')
    };
    const result = await userModel.paginate({}, options);
    console.log(result);
    return res.status(200).json(result);
  } catch (error) {
    console.log("From userController.js", error);
    return res.status(500).json(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);
    console.log(user);
    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }
    // console.log(`My user ${req.user}`);
    return res.status(200).json(user);
  } catch (error) {
    console.log("From userController.js", error);
    return res.status(500).json(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }
    return res.status(201).json(user);
  } catch (error) {
    console.log("From userController.js", error);
    return res.status(500).json(error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ Message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("From userController.js", error);
    return res.status(500).json(error.message);
  }
};

module.exports = {
  creatUser,
  login,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
};
