// Constantes de estado de órdenes compartidas entre admin y usuario

export const STATUS_LABEL = {
  processing: 'Pago aprobado',
  preparing:  'En preparación',
  shipped:    'En camino',
  delivered:  'Entregado',
  cancelled:  'Cancelado',
}

export const STATUS_COLOR = {
  processing: 'bg-green-100 text-green-700',
  preparing:  'bg-amber-100 text-amber-700',
  shipped:    'bg-blue-100 text-blue-700',
  delivered:  'bg-emerald-100 text-emerald-700',
  cancelled:  'bg-rose-100 text-rose-600',
}
