import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        // La contraseña NO es requerida si se registró con Google
        return !this.googleId
      },
    },
    googleId: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "viewer", "demo"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password antes de guardar
UserSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password)
}

// No devolver la contraseña en JSON
UserSchema.methods.toJSON = function () {
  const user = this.toObject()
  delete user.password
  return user
}

const User = mongoose.model("User", UserSchema)
export default User
