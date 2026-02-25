/**
 * Wrapper que elimina la necesidad de try/catch en cada controller.
 * Cualquier error lanzado es pasado automáticamente al error handler global.
 */
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
}
