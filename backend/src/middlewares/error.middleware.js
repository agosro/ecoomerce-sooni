/**
 * Middleware de manejo de errores global.
 * Debe registrarse al final de todos los middlewares en app.js.
 * Captura cualquier error pasado con next(error) desde los controllers.
 */
export const errorHandler = (err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err.message)

    // Errores de Mongoose: ID con formato inválido
    if (err.name === "CastError") {
        return res.status(400).json({ error: "ID inválido" })
    }

    // Errores de validación de Mongoose
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message)
        return res.status(400).json({ error: messages.join(", ") })
    }

    // Error genérico
    res.status(500).json({ error: err.message || "Error interno del servidor" })
}
