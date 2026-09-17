const userService = require("../services/user.service");

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();

  res.json({
    success: true,
    data: users,
  });
};

module.exports = {
  createUser,
  getAllUsers,
};