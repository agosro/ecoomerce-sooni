import Cart from "../models/Cart.js"
import Product from "../models/Product.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Helper: siempre devuelve el carrito con los productos populados
const getPopulatedCart = (userId) =>
  Cart.findOne({ userId }).populate("items.productId")

const removeItemFromCart = (cart, productId) => {
  cart.items = cart.items.filter((item) => item.productId.toString() !== productId)
}

// Obtener carrito del usuario (crea uno si no existe)
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId")

  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [] })
    await cart.save()
  }

  res.json(cart)
})

// Agregar producto al carrito
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body

  // Validar y parsear quantity
  const parsedQuantity = parseInt(quantity, 10)
  if (!parsedQuantity || parsedQuantity < 1 || isNaN(parsedQuantity)) {
    return res.status(400).json({ error: `La cantidad debe ser un número mayor a 0. Recibido: ${quantity}` })
  }

  if (!productId) {
    return res.status(400).json({ error: "productId es requerido" })
  }

  const product = await Product.findById(productId)
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" })
  }

  // Validar que el producto tenga precio
  if (!product.price || isNaN(product.price)) {
    return res.status(400).json({ error: "Producto sin precio válido" })
  }

  let cart = await Cart.findOne({ userId: req.user.id })
  if (!cart) {
    cart = new Cart({ userId: req.user.id, items: [] })
  }

  const existingItem = cart.items.find((item) => item.productId.toString() === productId)

  if (existingItem) {
    existingItem.quantity += parsedQuantity
  } else {
    cart.items.push({ productId, quantity: parsedQuantity, price: product.price })
  }

  cart.calculateTotal()
  await cart.save()

  res.json(await getPopulatedCart(req.user.id))
})

// Actualizar cantidad de un producto en el carrito
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body

  // Validar y parsear quantity
  const parsedQuantity = parseInt(quantity, 10)
  if (isNaN(parsedQuantity)) {
    return res.status(400).json({ error: "La cantidad debe ser un número válido" })
  }

  const cart = await Cart.findOne({ userId: req.user.id })
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" })
  }

  // Si la cantidad es 0 o menor, eliminar el ítem usando la función privada
  if (parsedQuantity <= 0) {
    removeItemFromCart(cart, productId)
    cart.calculateTotal()
    await cart.save()
    return res.json(await getPopulatedCart(req.user.id))
  }

  const item = cart.items.find((item) => item.productId.toString() === productId)
  if (!item) {
    return res.status(404).json({ error: "Producto no en carrito" })
  }

  item.quantity = parsedQuantity
  cart.calculateTotal()
  await cart.save()

  res.json(await getPopulatedCart(req.user.id))
})

// Eliminar producto del carrito
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body

  const cart = await Cart.findOne({ userId: req.user.id })
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" })
  }

  removeItemFromCart(cart, productId)
  cart.calculateTotal()
  await cart.save()

  res.json(await getPopulatedCart(req.user.id))
})

// Limpiar carrito
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id })
  if (!cart) {
    return res.status(404).json({ error: "Carrito no encontrado" })
  }

  cart.items = []
  cart.total = 0
  await cart.save()

  res.json(cart)
})
