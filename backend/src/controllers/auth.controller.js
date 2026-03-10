import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { asyncHandler } from "../utils/asyncHandler.js"

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET no está definido en las variables de entorno")

  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secret,
    { expiresIn: "7d" }
  )
}

export const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password } = req.body

  const usuarioExistente = await User.findOne({ email })
  if (usuarioExistente) {
    return res.status(400).json({ error: "El email ya está registrado" })
  }

  const usuario = new User({ name, email, password })
  await usuario.save()

  const token = generateToken(usuario)

  res.status(201).json({ token, user: usuario.toJSON() })
})

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  const usuario = await User.findOne({ email })
  if (!usuario || !usuario.password) {
    return res.status(401).json({ error: "Credenciales inválidas" })
  }

  const esValido = await usuario.comparePassword(password)
  if (!esValido) {
    return res.status(401).json({ error: "Credenciales inválidas" })
  }

  const token = generateToken(usuario)

  res.json({ token, user: usuario.toJSON() })
})

export const getProfile = asyncHandler(async (req, res) => {
  const usuario = await User.findById(req.user.id)
  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" })
  }
  res.json(usuario.toJSON())
})

export const googleAuth = asyncHandler(async (req, res) => {
  const { googleId, email, name } = req.body

  let usuario = await User.findOne({ googleId })

  if (!usuario) {
    usuario = new User({ name, email, googleId, role: "user" })
    await usuario.save()
  }

  const token = generateToken(usuario)

  res.json({ token, user: usuario.toJSON() })
})

export const updateAddress = asyncHandler(async (req, res) => {
  const { street, city, state, zipCode, country } = req.body

  const usuario = await User.findByIdAndUpdate(
    req.user.id,
    { savedAddress: { street, city, state, zipCode, country: country || 'Argentina' } },
    { returnDocument: 'after', runValidators: true }
  )

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" })
  }

  res.json({ savedAddress: usuario.savedAddress })
})

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, street, city, state, zipCode, country } = req.body

  const updates = {}
  if (name?.trim())  updates.name  = name.trim()
  if (phone !== undefined) updates.phone = phone.trim()
  updates.savedAddress = {
    street:  street  ?? '',
    city:    city    ?? '',
    state:   state   ?? '',
    zipCode: zipCode ?? '',
    country: country || 'Argentina',
  }

  const usuario = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    { returnDocument: 'after', runValidators: true }
  )

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" })
  }

  res.json(usuario.toJSON())
})
