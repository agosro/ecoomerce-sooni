import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "../models/Product.js"

dotenv.config()

const PRODUCTS = [
  {
    name: "Hydrating Serum",
    category: "Serums",
    description: "Serum hidratante con ácido hialurónico y centella asiática...",
    price: 890,
    currency: "ARS",
    imageUrl: "http://localhost:4000/images/products/serum.png",
    featured: true,
    stock: 20,
    benefits: [
      "Hidratación profunda",
      "Calma la piel",
      "Absorción rápida",
      "Reduce líneas finas",
    ],
    ingredients: [
      "Ácido Hialurónico",
      "Centella Asiática",
    ],
    usage: "Aplicar 2–3 gotas sobre el rostro limpio luego del tónico.",
  },
  {
    name: "Glow Cream",
    category: "Cremas",
    description: "Crema iluminadora con extracto de arroz fermentado...",
    price: 1250,
    currency: "ARS",
    imageUrl: "http://localhost:4000/images/products/cream.png",
    featured: true,
    stock: 15,
  },
  {
    name: "Calming Toner",
    category: "Tónicos",
    description: "Tónico calmante con té verde y aloe vera...",
    price: 650,
    currency: "ARS",
    imageUrl: "http://localhost:4000/images/products/toner.png",
    featured: true,
    stock: 25,
  },
  {
    name: "Gentle Cleanser",
    category: "Limpiadores",
    description: "Limpiador suave con pH balanceado...",
    price: 520,
    currency: "ARS",
    imageUrl: "http://localhost:4000/images/products/cleanser.png",
    featured: true,
    stock: 30,
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log("🟡 Eliminando productos existentes...")
    await Product.deleteMany()

    console.log("🟢 Insertando productos...")
    await Product.insertMany(PRODUCTS)

    console.log("✅ Seed completado correctamente")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error en el seed:", error)
    process.exit(1)
  }
}

seed()
