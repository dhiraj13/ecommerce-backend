const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// Create a User
const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    // Create a new User
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User Already Exists");
  }
});

// Login a User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// Update a User
const updateUser = asyncHandler(async (req, res) => {
  console.log(req.user);
  const { _id } = req.user;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Get All Users
const getAllUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a Single User
const getUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const getUser = await User.findById(_id);
    res.json({ getUser });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a Single User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (error) {
    throw new Error(error);
  }
});

// Block a User
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User Blocked",
      data: blockusr,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock a User
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const unblockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
      data: unblockusr,
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getAllUser,
  getUser,
  deleteUser,
  blockUser,
  unblockUser,
};
