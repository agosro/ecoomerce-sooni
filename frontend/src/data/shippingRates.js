// ─── TARIFAS DE ENVÍO POR PROVINCIA (ARS) ────────────────────────────────────
// Origen: Córdoba capital. A mayor distancia, mayor costo.
// Envío gratis cuando el subtotal supera FREE_SHIPPING_THRESHOLD.

export const FREE_SHIPPING_THRESHOLD = 100000

// Ordenadas de más cercanas a más lejanas desde Córdoba
export const SHIPPING_RATES = [
  { province: 'Córdoba',                         cost: 2500 },  // local
  { province: 'La Rioja',                        cost: 3500 },  // limítrofe
  { province: 'San Luis',                        cost: 3500 },  // limítrofe
  { province: 'Santiago del Estero',             cost: 4000 },  // limítrofe
  { province: 'Catamarca',                       cost: 4500 },  // limítrofe
  { province: 'Santa Fe',                        cost: 5000 },  // limítrofe
  { province: 'Tucumán',                         cost: 5500 },
  { province: 'La Pampa',                        cost: 5500 },
  { province: 'Mendoza',                         cost: 6000 },
  { province: 'San Juan',                        cost: 6000 },
  { province: 'Entre Ríos',                      cost: 7000 },
  { province: 'Buenos Aires',                    cost: 7000 },
  { province: 'Ciudad Autónoma de Buenos Aires', cost: 7500 },
  { province: 'Salta',                           cost: 7500 },
  { province: 'Corrientes',                      cost: 8000 },
  { province: 'Jujuy',                           cost: 8000 },
  { province: 'Chaco',                           cost: 8500 },
  { province: 'Misiones',                        cost: 9000 },
  { province: 'Formosa',                         cost: 9000 },
  { province: 'Neuquén',                         cost: 8500 },
  { province: 'Río Negro',                       cost: 9500 },
  { province: 'Chubut',                          cost: 11000 },
  { province: 'Santa Cruz',                      cost: 13000 },
  { province: 'Tierra del Fuego',                cost: 15000 },
]

/**
 * Retorna el costo de envío según la provincia y el subtotal.
 * Si supera FREE_SHIPPING_THRESHOLD → 0.
 * Si no se seleccionó provincia → null (pendiente).
 */
export function calcShipping(province, subtotal) {
  if (!province) return null
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  const rate = SHIPPING_RATES.find(r => r.province === province)
  return rate ? rate.cost : null
}
