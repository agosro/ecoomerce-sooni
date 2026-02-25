import { Router } from "express"
import {
  getProducts,
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js"
import { authMiddleware, adminMiddleware, adminOrViewerMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

// Rutas públicas (no requieren autenticación)
router.get("/", getProducts)

// Rutas protegidas (viewer puede ver, admin puede todo)
router.get("/admin", authMiddleware, adminOrViewerMiddleware, getAdminProducts)

router.get("/:id", getProductById)
router.post("/", authMiddleware, adminMiddleware, createProduct)
router.put("/:id", authMiddleware, adminMiddleware, updateProduct)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct)

export default router
