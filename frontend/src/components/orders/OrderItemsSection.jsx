// Lista de productos + desglose de costos de una orden
export default function OrderItemsSection({ items, total, discount, shippingCost }) {
  // subtotal = total + descuento - envío (siempre cuadra matemáticamente)
  const subtotalItems = (total ?? 0) + (discount ?? 0) - (shippingCost ?? 0)

  return (
    <div>
      <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-3">
        Productos
      </p>

      {/* Lista de ítems */}
      <div className="space-y-2">
        {items?.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <span className="text-stone-700">
              {item.productName || 'Producto'}
              <span className="text-stone-400 ml-1.5">×{item.quantity}</span>
            </span>
            <span className="text-stone-600 font-medium">
              ${(item.price * item.quantity).toLocaleString('es-AR')}
            </span>
          </div>
        ))}
      </div>

      {/* Desglose de costos */}
      <div className="mt-4 space-y-1.5 text-sm border-t border-stone-100 pt-3">
        <div className="flex justify-between text-stone-500">
          <span>Subtotal</span>
          <span>${subtotalItems.toLocaleString('es-AR')}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Descuento</span>
            <span>−${discount.toLocaleString('es-AR')}</span>
          </div>
        )}

        <div className="flex justify-between text-stone-500">
          <span>Envío</span>
          <span>
            {shippingCost > 0
              ? `$${shippingCost.toLocaleString('es-AR')}`
              : <span className="text-green-600">Gratis</span>}
          </span>
        </div>

        <div className="flex justify-between font-semibold text-ink border-t border-stone-100 pt-2 mt-1">
          <span>Total</span>
          <span>${total?.toLocaleString('es-AR')}</span>
        </div>
      </div>
    </div>
  )
}
