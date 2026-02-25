/**
 * 📋 ENDPOINTS DEL BACKEND - ECOMMERCE SOONI SKINCARE
 * 
 * AUTENTICACIÓN
 * POST   /api/auth/register          - Registrar usuario con email/contraseña
 * POST   /api/auth/login             - Login con email/contraseña
 * POST   /api/auth/google            - Login/Registro con Google
 * GET    /api/auth/profile           - Obtener perfil del usuario autenticado (requiere token)
 * 
 * PRODUCTOS (Admin)
 * GET    /api/products               - Obtener todos los productos (público)
 * GET    /api/products/:id           - Obtener producto por ID (público)
 * POST   /api/products               - Crear producto (requiere admin)
 * PUT    /api/products/:id           - Actualizar producto (requiere admin)
 * DELETE /api/products/:id           - Eliminar producto (requiere admin)
 * 
 * CARRITO
 * GET    /api/cart                   - Obtener carrito del usuario (requiere token)
 * POST   /api/cart/add               - Agregar producto al carrito (requiere token)
 * PUT    /api/cart/update            - Actualizar cantidad de un artículo (requiere token)
 * DELETE /api/cart/remove            - Eliminar producto del carrito (requiere token)
 * DELETE /api/cart/clear             - Limpiar carrito (requiere token)
 * 
 * ÓRDENES
 * POST   /api/orders                 - Crear orden desde el carrito (requiere token)
 * GET    /api/orders/user/me         - Obtener mis órdenes (requiere token)
 * GET    /api/orders/:id             - Obtener detalle de una orden (requiere token)
 * PUT    /api/orders/:id/status      - Actualizar estado de orden (requiere admin)
 * GET    /api/orders                 - Obtener todas las órdenes (requiere admin)
 * 
 * PAGOS (MERCADOPAGO)
 * POST   /api/payments/preference    - Crear preferencia de pago (requiere token)
 * POST   /api/payments/webhook       - Webhook de MercadoPago (sin autenticación)
 * GET    /api/payments/status        - Obtener estado de un pago
 */

// EJEMPLOS DE REQUESTS CON CURL O FETCH

// 1️⃣ REGISTRO
// POST /api/auth/register
// {
//   "name": "Juan Pérez",
//   "email": "juan@example.com",
//   "password": "miPassword123"
// }

// 2️⃣ LOGIN
// POST /api/auth/login
// {
//   "email": "juan@example.com",
//   "password": "miPassword123"
// }
// Respuesta: { token: "eyJhbGciOiJIUzI1NiIs...", user: {...} }

// 3️⃣ AGREGAR AL CARRITO
// POST /api/cart/add
// Headers: { "Authorization": "Bearer TOKEN_AQUI" }
// {
//   "productId": "65f1a2b3c4d5e6f7g8h9i0j1",
//   "quantity": 2
// }

// 4️⃣ CREAR ORDEN
// POST /api/orders
// Headers: { "Authorization": "Bearer TOKEN_AQUI" }
// {
//   "shippingAddress": {
//     "street": "Calle Principal 123",
//     "city": "Buenos Aires",
//     "state": "Buenos Aires",
//     "zipCode": "1425",
//     "country": "Argentina"
//   },
//   "notes": "Entregar antes de las 18hs"
// }

// 5️⃣ CREAR PREFERENCIA DE PAGO (MERCADOPAGO)
// POST /api/payments/preference
// Headers: { "Authorization": "Bearer TOKEN_AQUI" }
// {
//   "orderId": "65f1a2b3c4d5e6f7g8h9i0j1"
// }
// Respuesta: { preferenceId: "123456789", initPoint: "https://mercadopago.com/..." }

// 6️⃣ CREAR PRODUCTO (ADMIN)
// POST /api/products
// Headers: { "Authorization": "Bearer TOKEN_ADMIN" }
// {
//   "name": "Serum Facial",
//   "description": "Serum hidratante",
//   "price": 29.99,
//   "stock": 100,
//   "category": "serums",
//   "image": "serum.jpg"
// }
