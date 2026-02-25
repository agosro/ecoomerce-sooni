import Order from "../models/Order.js"
import Cart from "../models/Cart.js"
import User from "../models/User.js"
import Coupon from "../models/Coupon.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { createPreferenceFromCart, getPaymentById, searchPaymentsByReference } from "../services/mercadopago.service.js"

// ── Helper: crea una orden a partir de los datos del carrito/checkout ──────────
const buildAndSaveOrder = async ({ userId, items, subtotal, shippingCost, couponDiscount, shippingAddress, notes, paymentMethod, paymentId }) => {
  const total = Math.max(0, subtotal + (shippingCost ?? 0) - (couponDiscount ?? 0))
  const order = new Order({
    userId,
    items,
    total,
    shippingCost:    shippingCost ?? 0,
    discount:        couponDiscount ?? 0,
    shippingAddress,
    notes:           notes || '',
    status:         'processing',
    paymentMethod,
    paymentId,
    statusHistory:  [{ status: 'processing', changedAt: new Date() }],
  })
  await order.save()
  return order
}

// ── Helper: vacía el carrito del usuario ──────────────────────────────────────
const clearUserCart = (userId) =>
  Cart.findOneAndUpdate({ userId }, { items: [], total: 0 })

// ─── Crear preferencia de pago en MercadoPago ─────────────────────────────────
// Recibe los datos de checkout (dirección, costos) y lee el carrito desde la DB.
// No crea ninguna orden — la orden se crea en el webhook cuando el pago es aprobado.
export const createPaymentPreference = asyncHandler(async (req, res) => {
  const { address, shippingCost, couponDiscount, notes } = req.body

  const [cart, user] = await Promise.all([
    Cart.findOne({ userId: req.user.id }).populate("items.productId"),
    User.findById(req.user.id),
  ])

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío" })
  }

  const { preferenceId, initPoint } = await createPreferenceFromCart({
    user,
    cart,
    address,
    shippingCost:   shippingCost   ?? 0,
    couponDiscount: couponDiscount ?? 0,
    notes,
  })

  res.json({ preferenceId, initPoint })
})

// ─── Webhook de MercadoPago ───────────────────────────────────────────────────
// Cuando el pago es aprobado, crea la orden con los datos guardados en metadata.
export const paymentWebhook = asyncHandler(async (req, res) => {
  const { data, type } = req.query

  if (type !== "payment") return res.sendStatus(200)

  const payment = await getPaymentById(data.id)

  if (payment.status === "approved" && payment.metadata) {
    const m = payment.metadata

    // Evitar duplicados si el webhook se llama más de una vez
    const exists = await Order.findOne({ paymentId: payment.id.toString() })
    if (exists) return res.sendStatus(200)

    await buildAndSaveOrder({
      userId:          m.user_id || m.userId,
      items:           (m.items || []).map(i => ({
        productId:   i.product_id || i.productId,
        productName: i.product_name || i.productName,
        quantity:    i.quantity,
        price:       i.price,
      })),
      subtotal:        m.subtotal,
      shippingCost:    m.shipping_cost ?? m.shippingCost ?? 0,
      couponDiscount:  m.coupon_discount ?? m.couponDiscount ?? 0,
      shippingAddress: m.shipping_address || m.shippingAddress,
      notes:           m.notes,
      paymentMethod:   'mercadopago',
      paymentId:       payment.id.toString(),
    })

    await clearUserCart(m.user_id || m.userId)
  }

  res.sendStatus(200)
})

// ─── Simular pago aprobado (demo/portfolio) ───────────────────────────────────
// Crea la orden directamente desde el carrito, sin pasar por MercadoPago.
export const simulatePayment = asyncHandler(async (req, res) => {
  const { address, shippingCost, couponDiscount, notes } = req.body

  const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId")

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío" })
  }

  const order = await buildAndSaveOrder({
    userId:   req.user.id,
    items:    cart.items.map(item => ({
      productId:   item.productId._id,
      productName: item.productId.name,
      quantity:    item.quantity,
      price:       item.price,
    })),
    subtotal:        cart.total,
    shippingCost:    shippingCost   ?? 0,
    couponDiscount:  couponDiscount ?? 0,
    shippingAddress: address,
    notes,
    paymentMethod:   'mercadopago',
    paymentId:       `SIMULATED_${Date.now()}`,
  })

  await clearUserCart(req.user.id)

  // Incrementar usedCount del cupón si fue aplicado
  if (notes) {
    const match = notes.match(/Cupón: ([A-Z0-9]+)/)
    if (match) await Coupon.findOneAndUpdate({ code: match[1] }, { $inc: { usedCount: 1 } })
  }

  res.json({ success: true, orderId: order._id })
})

// ─── Simular pago fallido (demo/portfolio) ────────────────────────────────────
// No crea ninguna orden ni modifica el carrito.
export const simulateFailure = asyncHandler(async (req, res) => {
  res.json({ success: true })
})

// ─── Obtener estado del pago ──────────────────────────────────────────────────
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { external_reference } = req.query

  const results = await searchPaymentsByReference(external_reference)

  if (results.length === 0) {
    return res.status(404).json({ error: "Pago no encontrado" })
  }

  const payment = results[0]

  res.json({
    status:             payment.status,
    id:                 payment.id,
    external_reference: payment.external_reference,
  })
})

