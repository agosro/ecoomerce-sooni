import jwt from "jsonwebtoken"

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno")
  }
  return secret
}

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" })
    }

    const decoded = jwt.verify(token, getJwtSecret())
    req.user = decoded
    next()
  } catch (error) {
    if (error.message.includes("JWT_SECRET")) {
      return res.status(500).json({ error: "Error de configuración del servidor" })
    }
    return res.status(401).json({ error: "Token inválido" })
  }
}

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Solo administradores pueden acceder" })
  }
  next()
}

// Permite acceso de solo lectura al viewer y acceso completo al admin
export const adminOrViewerMiddleware = (req, res, next) => {
  const { role } = req.user
  if (role !== "admin" && role !== "viewer") {
    return res.status(403).json({ error: "Acceso denegado" })
  }
  next()
}

// Bloquea al usuario demo de rutas que modifican su cuenta (ej: editar perfil)
export const noDemoMiddleware = (req, res, next) => {
  if (req.user.role === "demo") {
    return res.status(403).json({ error: "El usuario demo no puede modificar datos de la cuenta" })
  }
  next()
}
