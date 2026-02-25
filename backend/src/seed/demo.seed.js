import mongoose from "mongoose"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, "../../.env") })

import User from "../models/User.js"

async function seedDemo() {
  try {
    const demoEmail = process.env.DEMO_EMAIL
    const demoPassword = process.env.DEMO_PASSWORD
    const demoName = process.env.DEMO_NAME || "Demo User"

    if (!demoEmail || !demoPassword) {
      console.error("❌ Debes definir DEMO_EMAIL y DEMO_PASSWORD en el .env")
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGO_URI)
    console.log("🔌 Conectado a MongoDB")

    const existing = await User.findOne({ email: demoEmail })

    if (existing) {
      console.log("⚠️  El usuario demo ya existe:", existing.email)
      process.exit(0)
    }

    await User.create({
      name: demoName,
      email: demoEmail,
      password: demoPassword,
      role: "demo",
    })

    console.log("✅ Usuario demo creado:", demoEmail)
    console.log("   Puede: agregar al carrito, simular compras")
    console.log("   No puede: editar perfil, acceder al dashboard admin")

    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

seedDemo()
