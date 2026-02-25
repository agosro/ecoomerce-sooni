import { MercadoPagoConfig, Preference } from 'mercadopago'

// ─── MERCADO PAGO CONFIGURATION ────────────────────────────────────────────────

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('⚠️  MERCADOPAGO_ACCESS_TOKEN no está configurado en .env')
}

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
})

export { mercadoPagoClient, Preference }
