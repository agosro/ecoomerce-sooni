import Product from "../models/Product.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { sendNotFound } from "../utils/apiResponse.js"

// GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const { featured } = req.query

  const filter = { active: true }
  if (featured) filter.featured = true

  const products = await Product.find(filter)
  res.json(products)
})

// GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return sendNotFound(res, "Producto no encontrado")
  res.json(product)
})

// GET /api/products/admin (admin)
export const getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 })
  res.json(products)
})

// POST /api/products (admin)
export const createProduct = asyncHandler(async (req, res) => {
  if (req.body.active === false) {
    req.body.featured = false
  }
  const product = await Product.create(req.body)
  res.status(201).json(product)
})

// PUT /api/products/:id (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  if (req.body.active === false) {
    req.body.featured = false
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!product) return sendNotFound(res, "Producto no encontrado")
  res.json(product)
})

// DELETE /api/products/:id (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return sendNotFound(res, "Producto no encontrado")
  res.status(204).end()
})
