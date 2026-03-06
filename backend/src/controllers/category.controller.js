import Category from "../models/Category.js"
import Product from "../models/Product.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// GET /api/categories — público, devuelve cada categoría con el conteo de productos
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 })
  const withCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({ category: cat.name })
      return { ...cat.toObject(), productCount: count }
    })
  )
  res.json(withCount)
})

// POST /api/categories — solo admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body
  if (!name?.trim()) return res.status(400).json({ error: "El nombre es requerido" })

  const exists = await Category.findOne({ name: name.trim() })
  if (exists) return res.status(400).json({ error: "La categoría ya existe" })

  const category = await Category.create({ name: name.trim() })
  res.status(201).json(category)
})

// DELETE /api/categories/:id — solo admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) return res.status(404).json({ error: "Categoría no encontrada" })

  const productCount = await Product.countDocuments({ category: category.name })
  if (productCount > 0) {
    return res.status(400).json({
      error: `No se puede eliminar. Hay ${productCount} producto${productCount !== 1 ? 's' : ''} que usan esta categoría.`
    })
  }

  await category.deleteOne()
  res.json({ success: true })
})
