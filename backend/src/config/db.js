import mongoose from "mongoose"

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 MongoDB connected"))
  .catch(err => console.error("🔴 MongoDB error", err))
