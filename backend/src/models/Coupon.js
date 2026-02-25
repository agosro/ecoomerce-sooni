import mongoose from "mongoose"

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        discountType: {
            type: String,
            enum: ["percent", "fixed"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        minOrderAmount: {
            type: Number,
            default: 0,
        },
        maxUses: {
            type: Number,
            default: null, // null = unlimited
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        active: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            default: null, // null = never expires
        },
    },
    { timestamps: true }
)

export default mongoose.model("Coupon", couponSchema)
