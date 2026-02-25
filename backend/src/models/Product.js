import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "ARS" },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },

    benefits: [String],
    ingredients: [String],
    usage: String,

    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model("Product", productSchema)
