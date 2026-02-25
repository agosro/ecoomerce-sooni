import { Router } from "express"
import {
    applyCoupon,
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
} from "../controllers/coupon.controller.js"
import { authMiddleware, adminMiddleware, adminOrViewerMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

// POST /api/coupons/apply — authenticated users
router.post("/apply", authMiddleware, applyCoupon)

// Admin o viewer (solo lectura)
router.get("/", authMiddleware, adminOrViewerMiddleware, getCoupons)
router.post("/", authMiddleware, adminMiddleware, createCoupon)
router.put("/:id", authMiddleware, adminMiddleware, updateCoupon)
router.delete("/:id", authMiddleware, adminMiddleware, deleteCoupon)

export default router
