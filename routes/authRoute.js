const express = require("express");
const {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/refresh", handleRefreshToken);
router.put("/edit-user", authMiddleware, updateUser);
router.get("/all-users", getAllUser);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/:id", deleteUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);
module.exports = router;
