import { mercadoPagoClient, Preference } from '../config/mercadopago.js'

/**
 * Crea una preferencia de pago en MercadoPago directamente desde el carrito.
 * Almacena todos los datos necesarios en metadata para que el webhook
 * pueda crear la orden cuando el pago sea aprobado (sin orden previa).
 *
 * @param {Object} params
 * @param {Object} params.user       - Documento User de MongoDB
 * @param {Object} params.cart       - Carrito populado (items.productId)
 * @param {Object} params.address    - Dirección de envío
 * @param {number} params.shippingCost
 * @param {number} params.couponDiscount
 * @param {string} params.notes
 * @returns {Object} { preferenceId, initPoint }
 */
export const createPreferenceFromCart = async ({ user, cart, address, shippingCost, couponDiscount, notes }) => {
  const preference = new Preference(mercadoPagoClient)

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  const backendUrl  = process.env.BACKEND_URL  || 'http://localhost:4000'
  const isLocalhost = frontendUrl.includes('localhost') || frontendUrl.includes('127.0.0.1')

  // Referencia externa única por intento de pago (no es un orderId)
  const externalRef = `${user._id}_${Date.now()}`

  // Datos completos de la orden para recrearla en el webhook
  const orderMetadata = {
    userId:          user._id.toString(),
    items:           cart.items.map(item => ({
      productId:   item.productId._id.toString(),
      productName: item.productId.name,
      quantity:    item.quantity,
      price:       item.price,
    })),
    subtotal:        cart.total,
    shippingCost:    shippingCost ?? 0,
    couponDiscount:  couponDiscount ?? 0,
    total:           Math.max(0, cart.total + (shippingCost ?? 0) - (couponDiscount ?? 0)),
    shippingAddress: address,
    notes:           notes || '',
  }

  const response = await preference.create({
    body: {
      items: cart.items.map((item) => ({
        title:      item.productId.name,
        quantity:   item.quantity,
        unit_price: Number(item.price),
        currency_id: 'ARS',
        id:         item.productId._id.toString(),
      })),
      payer: {
        name:    user.name  || 'Cliente',
        surname: user.lastName || 'Anónimo',
        email:   user.email || 'test@test.com',
        address: {
          street_name: address?.street || 'Dirección no especificada',
          street_number: 1,
          zip_code: address?.zipCode || '1000',
        },
      },
      back_urls: {
        success: `${frontendUrl}/checkout/success`,
        failure: `${frontendUrl}/checkout/failure`,
        pending: `${frontendUrl}/checkout/pending`,
      },
      notification_url: `${backendUrl}/api/payments/webhook`,
      ...(isLocalhost ? {} : { auto_return: 'approved' }),
      external_reference: externalRef,
      metadata:           orderMetadata,
      statement_descriptor: 'Sooni Skincare',
      binary_mode: false,
    },
  })

  return {
    preferenceId: response.id,
    initPoint:    response.init_point,
    externalRef,
  }
}

/**
 * Obtiene los detalles de un pago por su ID.
 * @param {string} paymentId
 * @returns {Object} datos del pago
 */
export const getPaymentById = async (paymentId) => {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    }
  )
  return response.json()
}

/**
 * Busca pagos por referencia externa (ID de orden).
 * @param {string} externalReference
 * @returns {Array} lista de pagos
 */
export const searchPaymentsByReference = async (externalReference) => {
  const response = await fetch(
    `https://api.mercadopago.com/v1/payments/search?external_reference=${externalReference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    }
  )
  const data = await response.json()
  return data.results
}