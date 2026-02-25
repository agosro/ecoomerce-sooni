import { useState } from 'react'
import { STATUS_LABEL, STATUS_COLOR } from '../../utils/orderStatus'
import OrderStatusTimeline from './OrderStatusTimeline'
import OrderItemsSection from './OrderItemsSection'
import OrderShippingSection from './OrderShippingSection'

export default function OrderCard({ order }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

      {/* Cabecera clickeable */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-stone-50 transition"
      >
        <div>
          <p className="font-medium text-ink text-sm">
            Orden #{order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('es-AR', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
          <p className="text-sm font-semibold text-ink">
            ${order.total?.toLocaleString('es-AR')}
          </p>
          <svg
            className={`w-4 h-4 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Detalle expandido */}
      {open && (
        <div className="border-t border-stone-100 px-6 py-5 space-y-6">
          <OrderStatusTimeline statusHistory={order.statusHistory} />
          <OrderItemsSection
            items={order.items}
            total={order.total}
            discount={order.discount}
            shippingCost={order.shippingCost}
          />
          <OrderShippingSection
            shippingAddress={order.shippingAddress}
            paymentMethod={order.paymentMethod}
          />
        </div>
      )}

    </div>
  )
}
