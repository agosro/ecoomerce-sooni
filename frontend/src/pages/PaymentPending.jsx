import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Clock } from 'lucide-react'

// ─── PAYMENT PENDING ───────────────────────────────────────────────────────────

export default function PaymentPending() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentId = searchParams.get('payment_id')

  useEffect(() => {
    const timer = setTimeout(() => navigate('/orders'), 8000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <section className="min-h-screen bg-ivory/40 flex items-center justify-center py-12 px-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-md">
        <Clock size={64} className="mx-auto text-amber-500 mb-6 animate-spin" />
        
        <h1 className="text-3xl font-serifkr text-ink mb-2">
          Pago pendiente
        </h1>
        
        <p className="text-stone-600 mb-4">
          Tu pago está en proceso de validación.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-xs text-stone-500 mb-2">
            Para pagos en efectivo (Rapipago, Baloto, etc.), deberás completar el pago en el establecimiento correspondiente usando el comprobante que generó Mercado Pago.
          </p>
          {paymentId && (
            <p className="text-xs font-mono text-stone-700">
              <span className="text-stone-500">ID Pago: </span>{paymentId}
            </p>
          )}
        </div>

        <p className="text-stone-500 text-sm mb-6">
          Te redirigiremos a tus órdenes en 8 segundos...
        </p>

        <button
          onClick={() => navigate('/orders')}
          className="w-full bg-sage text-white py-3 rounded-full font-medium hover:bg-sage/90 transition"
        >
          Ver mis órdenes
        </button>

        <button
          onClick={() => navigate('/carrito')}
          className="w-full mt-3 bg-stone-100 text-stone-700 py-3 rounded-full font-medium hover:bg-stone-200 transition"
        >
          Volver al carrito
        </button>
      </div>
    </section>
  )
}
