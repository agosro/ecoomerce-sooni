import { Router } from "express"
import {
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} from "../controllers/order.controller.js"
import { authMiddleware, adminMiddleware, adminOrViewerMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

// Rutas protegidas (requieren autenticación)
router.get("/user/me", authMiddleware, getUserOrders)
router.get("/:id", authMiddleware, getOrderById)

// Rutas de admin (viewer puede ver, solo admin puede modificar)
router.get("/", authMiddleware, adminOrViewerMiddleware, getAllOrders)
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus)

export default router
