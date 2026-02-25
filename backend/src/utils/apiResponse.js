/**
 * Helpers para respuestas HTTP consistentes en todos los controllers.
 */
export const sendSuccess = (res, data, status = 200) => {
    return res.status(status).json(data)
}

export const sendError = (res, message, status = 500) => {
    return res.status(status).json({ error: message })
}

export const sendNotFound = (res, message = "Recurso no encontrado") => {
    return res.status(404).json({ error: message })
}
