import express from "express"
import cors from "cors"
import productRoutes from "./routes/product.routes.js"
import authRoutes from "./routes/auth.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import orderRoutes from "./routes/order.routes.js"
import paymentRoutes from "./routes/payment.routes.js"
import couponRoutes from "./routes/coupon.routes.js"
import uploadRoutes from "./routes/upload.routes.js"
import { errorHandler } from "./middlewares/error.middleware.js"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(express.json())

// 🔥 SERVIR IMÁGENES
app.use("/images", express.static(path.join(__dirname, "../public/images")))

// 🔐 RUTAS DE AUTENTICACIÓN
app.use("/api/auth", authRoutes)

// 🛒 RUTAS DE PRODUCTOS
app.use("/api/products", productRoutes)

// 🛒 RUTAS DE CARRITO
app.use("/api/cart", cartRoutes)

// 📦 RUTAS DE ÓRDENES
app.use("/api/orders", orderRoutes)

// 💳 RUTAS DE PAGOS (MERCADOPAGO)
app.use("/api/payments", paymentRoutes)

// 🎟️ RUTAS DE CUPONES
app.use("/api/coupons", couponRoutes)

// 🖼️ SUBIDA DE IMÁGENES
app.use("/api/upload", uploadRoutes)

// ⚠️ ERROR HANDLER GLOBAL (debe ir al final)
app.use(errorHandler)

export default app
