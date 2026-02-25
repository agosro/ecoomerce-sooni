import { Router } from "express"
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cart.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

// Todas las rutas de carrito requieren autenticación
router.use(authMiddleware)

router.get("/", getCart)
router.post("/add", addToCart)
router.put("/update", updateCartItem)
router.delete("/remove", removeFromCart)
router.delete("/clear", clearCart)

export default router
