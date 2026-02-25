// Sección de dirección de envío y método de pago
export default function OrderShippingSection({ shippingAddress, paymentMethod }) {
  const addr = shippingAddress
  const hasAddress = addr && (addr.street || addr.city)

  return (
    <div className="space-y-4">
      {/* Dirección */}
      {hasAddress && (
        <div>
          <p className="text-xs font-medium text-stone-500 uppercase tracking-widest mb-3">
            Dirección de envío
          </p>
          <div className="bg-stone-50 rounded-xl px-4 py-3 text-sm text-stone-600 space-y-0.5">
            {addr.street && <p>{addr.street}</p>}
            {(addr.city || addr.state) && (
              <p>{[addr.city, addr.state].filter(Boolean).join(', ')}</p>
            )}
            {(addr.zipCode || addr.country) && (
              <p>{[addr.zipCode, addr.country].filter(Boolean).join(' · ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Método de pago */}
      {paymentMethod && (
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          {paymentMethod === 'mercadopago' ? 'Mercado Pago' : paymentMethod}
        </div>
      )}
    </div>
  )
}
