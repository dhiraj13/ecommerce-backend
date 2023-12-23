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
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrderStatus,
  getAllOrders,
  getOrderByUserId,
  removeProductFromCart,
  updateProductQuantityFromCart,
} = require("../controller/userCtrl")
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const router = express.Router()
router.post("/register", createUser)
router.put("/password", authMiddleware, updatePassword)
router.post("/login", loginUser)
router.post("/admin-login", loginAdmin)
router.post("/cart", authMiddleware, userCart)
router.post("/cart/applycoupon", authMiddleware, applyCoupon)
router.post("/cart/cash-order", authMiddleware, createOrder)
router.get("/refresh", handleRefreshToken)
router.get("/logout", logoutUser)
router.put("/edit-user", authMiddleware, updateUser)
router.put("/save-address", authMiddleware, saveAddress)
router.post("/forgot-password-token", forgotPasswordToken)
router.put("/reset-password/:token", resetPassword)
router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
)
router.get("/all-users", getAllUser)
router.get("/get-orders", authMiddleware, getOrders)
router.get("/get-all-orders", authMiddleware, isAdmin, getAllOrders)
router.get(
  "/get-order-by-user-id/:id",
  authMiddleware,
  isAdmin,
  getOrderByUserId
)
router.get("/wishlist", authMiddleware, getWishlist)
router.get("/cart", authMiddleware, getUserCart)
router.get("/:id", authMiddleware, isAdmin, getUser)
router.delete("/empty-cart", authMiddleware, emptyCart)
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
