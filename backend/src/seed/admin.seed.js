import mongoose from "mongoose"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, "../../.env") })

// Inline User import to avoid path issues
import User from "../models/User.js"

async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminName = process.env.ADMIN_NAME || "Admin SOONI"

    if (!adminEmail || !adminPassword) {
      console.error("❌ Debes definir ADMIN_EMAIL y ADMIN_PASSWORD en el .env")
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGO_URI)
    console.log("🔌 Conectado a MongoDB")

    const existing = await User.findOne({ email: adminEmail })

    if (existing) {
      console.log("⚠️  El admin ya existe:", existing.email)
      process.exit(0)
    }

    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    })

    console.log("✅ Admin creado:", adminEmail)

    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

seedAdmin()
