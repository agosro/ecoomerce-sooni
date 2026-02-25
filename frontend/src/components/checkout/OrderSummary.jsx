import { Truck } from 'lucide-react'
import { FREE_SHIPPING_THRESHOLD } from '../../data/shippingRates'
import CouponInput from './CouponInput'

// ─── ORDER SUMMARY ────────────────────────────────────────────────────────────

export default function OrderSummary({
  items,
  subtotal,
  discount,
  shippingCost,
  finalTotal,
  coupon,
  couponCode,
  onCouponChange,
  onCouponApply,
  onCouponRemove,
  couponLoading,
  couponError,
}) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-8 sticky top-24">
      <h2 className="text-sm font-medium text-stone-500 uppercase tracking-widest mb-6">
        Resumen
      </h2>

      {/* Item list */}
      <div className="space-y-3 text-sm text-stone-500 mb-4">
        {items?.map((item) => (
          <div key={item._id} className="flex justify-between">
            <span>
              {item.productId?.name || 'Producto'}
              <span className="text-stone-300 ml-1">×{item.quantity}</span>
            </span>
            <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
          </div>
        ))}
      </div>

      <hr className="border-stone-100 my-4" />

      <CouponInput
        coupon={coupon}
        code={couponCode}
        onChange={onCouponChange}
        onApply={onCouponApply}
        onRemove={onCouponRemove}
        loading={couponLoading}
        error={couponError}
      />

      {/* Totals */}
      <div className="space-y-2 text-sm text-stone-500">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString('es-AR')}</span>
        </div>
        {coupon && (
          <div className="flex justify-between text-sage">
            <span>Descuento</span>
            <span>-${discount.toLocaleString('es-AR')}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1"><Truck size={13} /> Envío</span>
          <span className={shippingCost === 0 ? 'text-sage font-medium' : 'text-stone-700'}>
            {shippingCost === null
              ? <span className="text-stone-300 italic text-xs">Seleccioná provincia</span>
              : shippingCost === 0
                ? 'Gratis 🎉'
                : `$${shippingCost.toLocaleString('es-AR')}`
            }
          </span>
        </div>
      </div>

      <hr className="border-stone-200 my-4" />

      <div className="flex justify-between text-stone-700 font-medium">
        <span>Total</span>
        <span>${finalTotal.toLocaleString('es-AR')}</span>
      </div>

      <p className="text-xs text-stone-300 mt-4 text-center">
        Envío gratis en pedidos mayores a ${FREE_SHIPPING_THRESHOLD.toLocaleString('es-AR')}
      </p>
    </div>
  )
}
