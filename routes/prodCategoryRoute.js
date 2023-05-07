const express = require("express");
const {
  createCategory,
  updateCategory,
} = require("../controller/prodCategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory);
router.put("/:id", authMiddleware, isAdmin, updateCategory);

module.exports = router;
