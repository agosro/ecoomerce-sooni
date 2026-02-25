import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

const api = axios.create({
  baseURL: API_URL,
})

// Agregar token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el token expira, limpiar sesión y redirigir al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new StorageEvent('storage', { key: 'token' }))
      if (!window.location.pathname.includes('/setup')) {
        window.location.href = '/setup'
      }
    }
    return Promise.reject(error)
  }
)

// Auth
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
  getProfile: () => api.get('/auth/profile'),
}

// Products
export const productService = {
  getAll: () => api.get('/products'),
  getAdminAll: () => api.get('/products/admin'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
}

// Cart
export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
  updateItem: (productId, quantity) => api.put('/cart/update', { productId, quantity }),
  removeItem: (productId) => api.delete('/cart/remove', { data: { productId } }),
  clearCart: () => api.delete('/cart/clear'),
}

// Orders
export const orderService = {
  getUserOrders: () => api.get('/orders/user/me'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getAll: () => api.get('/orders'),
}

// Payments
// checkoutData = { address, shippingCost, couponDiscount, notes }
export const paymentService = {
  createPreference: (checkoutData) => api.post('/payments/preference', checkoutData),
  simulate:         (checkoutData) => api.post('/payments/simulate', checkoutData),
  simulateFailure:  ()             => api.post('/payments/simulate-failure'),
  getPaymentStatus: (externalReference) =>
    api.get('/payments/status', { params: { external_reference: externalReference } }),
}

// Coupons
export const couponService = {
  apply: (code, orderTotal) => api.post('/coupons/apply', { code, orderTotal }),
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
}

// Upload
export const uploadService = {
  image: (file) => {
    const fd = new FormData()
    fd.append('image', file)
    return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}

export default api
