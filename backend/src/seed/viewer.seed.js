import mongoose from "mongoose"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, "../../.env") })

import User from "../models/User.js"

async function seedViewer() {
  try {
    const viewerEmail = process.env.VIEWER_EMAIL
    const viewerPassword = process.env.VIEWER_PASSWORD
    const viewerName = process.env.VIEWER_NAME || "Viewer SOONI"

    if (!viewerEmail || !viewerPassword) {
      console.error("❌ Debes definir VIEWER_EMAIL y VIEWER_PASSWORD en el .env")
      process.exit(1)
    }

    await mongoose.connect(process.env.MONGO_URI)
    console.log("🔌 Conectado a MongoDB")

    const existing = await User.findOne({ email: viewerEmail })

    if (existing) {
      console.log("⚠️  El viewer ya existe:", existing.email)
      process.exit(0)
    }

    await User.create({
      name: viewerName,
      email: viewerEmail,
      password: viewerPassword,
      role: "viewer",
    })

    console.log("✅ Viewer creado:", viewerEmail)

    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

seedViewer()
