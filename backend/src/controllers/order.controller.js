import Order from "../models/Order.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// Obtener órdenes del usuario
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id })
    .populate("items.productId")
    .sort({ createdAt: -1 })

  res.json(orders)
})

// Obtener detalle de una orden
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.productId")

  if (!order) {
    return res.status(404).json({ error: "Orden no encontrada" })
  }

  // Verificar que el usuario sea el dueño de la orden o admin
  if (order.userId.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ error: "No tienes permiso para ver esta orden" })
  }

  res.json(order)
})

// Actualizar estado de orden (solo admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  const VALID_STATUSES = ["processing", "preparing", "shipped", "delivered", "cancelled"]

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Estado inválido. Valores permitidos: ${VALID_STATUSES.join(", ")}` })
  }

  const order = await Order.findById(req.params.id)

  if (!order) {
    return res.status(404).json({ error: "Orden no encontrada" })
  }

  order.status = status

  // Si el historial está vacío (orden creada antes del feature),
  // reconstruir la entrada inicial de "processing" con la fecha de creación.
  if (order.statusHistory.length === 0) {
    order.statusHistory.push({ status: 'processing', changedAt: order.createdAt })
  }

  order.statusHistory.push({ status, changedAt: new Date() })
  await order.save()

  res.json(order)
})

// Obtener todas las órdenes (solo admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .populate("items.productId")
    .sort({ createdAt: -1 })

  res.json(orders)
})
