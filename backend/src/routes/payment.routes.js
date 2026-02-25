import { Router } from "express"
import {
  createPaymentPreference,
  paymentWebhook,
  getPaymentStatus,
  simulatePayment,
  simulateFailure,
} from "../controllers/payment.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

// Simular pago (demo/portfolio)
router.post("/simulate", authMiddleware, simulatePayment)
router.post("/simulate-failure", authMiddleware, simulateFailure)

// Crear preferencia de pago (requiere autenticación)
router.post("/preference", authMiddleware, createPaymentPreference)

// Webhook de MercadoPago (sin autenticación, es llamada por MercadoPago)
router.post("/webhook", paymentWebhook)

// Obtener estado de pago
router.get("/status", getPaymentStatus)

export default router
