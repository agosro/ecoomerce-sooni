import Coupon from "../models/Coupon.js"
import { asyncHandler } from "../utils/asyncHandler.js"

// POST /api/coupons/apply — any authenticated user
export const applyCoupon = asyncHandler(async (req, res) => {
    const { code, orderTotal } = req.body

    const coupon = await Coupon.findOne({ code: code?.toUpperCase() })

    if (!coupon || !coupon.active) {
        return res.status(404).json({ error: "Cupón no válido o inactivo" })
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return res.status(400).json({ error: "El cupón ha expirado" })
    }

    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ error: "El cupón ha alcanzado su límite de usos" })
    }

    if (orderTotal < coupon.minOrderAmount) {
        return res.status(400).json({
            error: `El pedido mínimo para este cupón es $${coupon.minOrderAmount.toLocaleString("es-AR")}`,
        })
    }

    const discount =
        coupon.discountType === "percent"
            ? (orderTotal * coupon.discountValue) / 100
            : Math.min(coupon.discountValue, orderTotal)

    res.json({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: Math.round(discount),
    })
})

// GET /api/coupons — admin only
export const getCoupons = asyncHandler(async (_, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 })
    res.json(coupons)
})

// POST /api/coupons — admin only
export const createCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.create(req.body)
    res.status(201).json(coupon)
})

// PUT /api/coupons/:id — admin only
export const updateCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!coupon) return res.status(404).json({ error: "Cupón no encontrado" })
    res.json(coupon)
})

// DELETE /api/coupons/:id — admin only
export const deleteCoupon = asyncHandler(async (req, res) => {
    await Coupon.findByIdAndDelete(req.params.id)
    res.status(204).end()
})
