const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")
const User = require("../models/userModel")
const fs = require("fs")
const {
  cloudinaryDeleteImg,
  cloudinaryUploadImg,
} = require("../utils/cloudinary")
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const newProduct = await Product.create(req.body)
    res.json(newProduct)
  } catch (error) {
    throw new Error(error)
  }
})

const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const findProduct = await Product.findById(id).populate("color")
    res.json(findProduct)
  } catch (error) {
    throw new Error(error)
  }
})

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    })
    res.json(updateProduct)
  } catch (error) {
    throw new Error(error)
  }
})

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const deleteProduct = await Product.findOneAndDelete(id)
    res.json(deleteProduct)
  } catch (error) {
    throw new Error(error)
  }
})

const getAllProduct = asyncHandler(async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query }
    const excludeFields = ["page", "sort", "limit", "fields"]
    excludeFields.forEach((el) => delete queryObj[el])
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    let query = Product.find(JSON.parse(queryStr))

    // Sorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ")
      query = query.sort(sortBy)
    } else {
      query = query.sort("-createdAt")
    }

    // Limiting the Fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ")
      query = query.select(fields)
    } else {
      query = query.select("-__v")
    }

    // Pagination
    const page = req.query.page
    const limit = req.query.limit
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)
    if (req.query.page) {
      const productCount = await Product.countDocuments()
      if (skip >= productCount) throw new Error("This Page does not exists")
    }
    console.log(page, limit, skip)

    const product = await query
    res.json(product)
  } catch (error) {
    throw new Error(error)
  }
})

const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { prodId } = req.body

  try {
    const user = await User.findById(_id)
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId)
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      )
      res.json(user)
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      )
      res.json(user)
    }
  } catch (error) {
    throw new Error(error)
  }
})

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { comment, star, prodId } = req.body
  try {
    const product = await Product.findById(prodId)
    let alreadyRated = product.ratings.find(
      (rating) => rating.postedby.toString() === _id.toString()
    )
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      )
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star,
              comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      )
    }
    const getAllRatings = await Product.findById(prodId)
    let totalRatings = getAllRatings.ratings.length
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0)
    let actualRating = Math.round(ratingSum / totalRatings)
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    )
    res.json(finalproduct)
  } catch (error) {
    throw new Error(error)
  }
})

const uploadImages = asyncHandler(async (req, res) => {
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images")
    const urls = []
    const files = req.files
    for (const file of files) {
      const { path } = file
      const newpath = await uploader(path)
      urls.push(newpath)
      fs.unlinkSync(path)
    }
    const images = urls.map((file) => file)
    res.json(images)
  } catch (error) {
    throw new Error(error)
  }
})

const deleteImages = asyncHandler(async (req, res) => {
  const { id } = req.params
  try {
    const deleted = cloudinaryDeleteImg(id, "images")
    res.json({ message: "Deleted" })
  } catch (error) {
    throw new Error(error)
  }
})

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  addToWishlist,
  rating,
  uploadImages,
  deleteImages,
}
