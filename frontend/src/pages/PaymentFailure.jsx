import { useNavigate, useSearchParams } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'

// ─── PAYMENT FAILURE ───────────────────────────────────────────────────────────

export default function PaymentFailure() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const reason = searchParams.get('status')
  const paymentId = searchParams.get('payment_id')

  const reasonText = {
    'rejected': '❌ Tu tarjeta fue rechazada. Por favor, verifica los datos e intenta con otro medio de pago.',
    'cancelled': '⏹️ Cancelaste el pago. Puedes intentar nuevamente cuando lo desees.',
    'insufficient_funds': '💔 Fondos insuficientes en tu cuenta. Intenta con otro medio de pago.',
  }

  return (
    <section className="min-h-screen bg-ivory/40 flex items-center justify-center py-12 px-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-md">
        <AlertCircle size={64} className="mx-auto text-rose-400 mb-6" />
        
        <h1 className="text-3xl font-serifkr text-ink mb-2">
          Pago no completado
        </h1>
        
        <p className="text-stone-600 mb-4">
          {reasonText[reason] || 'Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.'}
        </p>

        {paymentId && (
          <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 mb-6 text-xs">
            <p className="text-stone-600">
              <span className="text-stone-500">ID Pago: </span>
              <span className="font-mono text-stone-800">{paymentId}</span>
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-sage text-white py-3 rounded-full font-medium hover:bg-sage/90 transition"
          >
            Intentar nuevamente
          </button>
          <button
            onClick={() => navigate('/carrito')}
            className="w-full bg-stone-100 text-stone-700 py-3 rounded-full font-medium hover:bg-stone-200 transition"
          >
            Volver al carrito
          </button>
          <button
            onClick={() => navigate('/productos')}
            className="w-full bg-stone-100 text-stone-700 py-3 rounded-full font-medium hover:bg-stone-200 transition"
          >
            Continuar comprando
          </button>
        </div>
      </div>
    </section>
  )
}
