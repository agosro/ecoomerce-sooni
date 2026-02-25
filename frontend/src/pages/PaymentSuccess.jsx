import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'

// ─── PAYMENT SUCCESS ───────────────────────────────────────────────────────────

export default function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { fetchCart } = useCart()
  const externalRef = searchParams.get('external_reference') || searchParams.get('order')
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')

  useEffect(() => {
    // Sincronizar el carrito: el backend lo limpió al confirmar el pago
    fetchCart()
    const timer = setTimeout(() => navigate('/orders'), 5000)
    return () => clearTimeout(timer)
  }, [navigate, fetchCart])

  return (
    <section className="min-h-screen bg-ivory/40 flex items-center justify-center py-12 px-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-md">
        <CheckCircle size={64} className="mx-auto text-sage mb-6" />
        
        <h1 className="text-3xl font-serifkr text-ink mb-2">
          ¡Pago exitoso!
        </h1>
        
        <p className="text-stone-600 mb-6">
          Tu orden ha sido procesada correctamente.
        </p>

        {(externalRef || paymentId) && (
          <div className="bg-sage/10 border border-sage/20 rounded-lg p-3 mb-6 text-xs">
            {externalRef && (
              <p className="text-stone-600 mb-1">
                <span className="text-stone-500">Ref. orden: </span>
                <span className="font-mono text-stone-800">{externalRef}</span>
              </p>
            )}
            {paymentId && (
              <p className="text-stone-600">
                <span className="text-stone-500">ID Pago: </span>
                <span className="font-mono text-stone-800">{paymentId}</span>
              </p>
            )}
          </div>
        )}

        <p className="text-stone-400 text-sm mb-6">
          Serás redirigido a tus órdenes en 5 segundos...
        </p>

        <button
          onClick={() => navigate('/orders')}
          className="w-full bg-sage text-white py-3 rounded-full font-medium hover:bg-sage/90 transition"
        >
          Ver mis órdenes
        </button>
      </div>
    </section>
  )
}
