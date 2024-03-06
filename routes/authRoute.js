const express = require("express")
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
  saveAddress,
  userCart,
  getUserCart,
  createOrder,
  removeProductFromCart,
  updateProductQuantityFromCart,
  getMyOrders,
  getMonthWiseOrderIncome,
  getYearlyTotalOrders,
  getAllOrders,
  getSingleOrder,
} = require("../controller/userCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()
router.post("/register", createUser)
router.put("/password", authMiddleware, updatePassword)
router.post("/login", loginUser)
router.post("/admin-login", loginAdmin)
router.post("/cart", authMiddleware, userCart)
router.post("/cart/create-order", authMiddleware, createOrder)
router.get("/refresh", handleRefreshToken)
router.get("/logout", logoutUser)
router.put("/edit-user", authMiddleware, updateUser)
router.put("/save-address", authMiddleware, saveAddress)
router.post("/forgot-password-token", forgotPasswordToken)
router.put("/reset-password/:token", resetPassword)
router.get("/all-users", getAllUser)
router.get("/get-my-orders", authMiddleware, getMyOrders)
router.get("/get-all-orders", authMiddleware, getAllOrders)
router.get("/get-order/:id", authMiddleware, getSingleOrder)
router.get("/wishlist", authMiddleware, getWishlist)
router.get("/cart", authMiddleware, getUserCart)
router.get(
  "/get-month-wise-order-income",
  authMiddleware,
  getMonthWiseOrderIncome
)
router.get("/get-yearly-total-orders", authMiddleware, getYearlyTotalOrders)
router.get("/:id", authMiddleware, getUser)
router.delete(
  "/delete-cart-product/:cartItemId",
  authMiddleware,
  removeProductFromCart
)
router.put(
  "/update-cart-product-quantity/:cartItemId/:newQuantity",
  authMiddleware,
  updateProductQuantityFromCart
)
router.delete("/:id", deleteUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)

module.exports = router
