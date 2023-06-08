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
  logoutUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
router.post("/register", createUser);
router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logoutUser);
router.put("/edit-user", authMiddleware, updateUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.get("/all-users", getAllUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/:id", deleteUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = router;
