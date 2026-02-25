import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productName: String,
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["processing", "preparing", "shipped", "delivered", "cancelled"],
      default: "processing",
    },
    paymentId: {
      type: String, // ID de MercadoPago
    },
    paymentMethod: {
      type: String,
      enum: ["mercadopago", "credit_card"],
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    notes: String,
    statusHistory: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model("Order", OrderSchema)
export default Order
