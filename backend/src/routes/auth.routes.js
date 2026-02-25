import { Router } from "express"
import { body } from "express-validator"
import {
  register,
  login,
  getProfile,
  googleAuth,
} from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

// Registro con email y contraseña
router.post(
  "/register",
  [
    body("name", "El nombre es requerido").trim().notEmpty(),
    body("email", "Email inválido").isEmail(),
    body("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
  ],
  register
)

// Login con email y contraseña
router.post(
  "/login",
  [
    body("email", "Email inválido").isEmail(),
    body("password", "El password es requerido").notEmpty(),
  ],
  login
)

// Obtener perfil del usuario autenticado
router.get("/profile", authMiddleware, getProfile)

// Login/Registro con Google
router.post("/google", googleAuth)

export default router
