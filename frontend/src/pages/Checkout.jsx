import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { paymentService, couponService } from '../services/api'
import { calcShipping } from '../data/shippingRates'
import AddressForm from '../components/checkout/AddressForm'
import OrderSummary from '../components/checkout/OrderSummary'

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, fetchCart } = useCart()

  const [payLoading, setPayLoading] = useState(false)
  const [error, setError]           = useState('')
  const [address, setAddress]       = useState({ street: '', city: '', state: '', zipCode: '', country: 'Argentina' })
  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon]         = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  // false = formulario, true = selección de pago
  const [showPayment, setShowPayment] = useState(false)

  // Si el carrito se vacía (pago confirmado) y no estamos en la pantalla de pago → redirigir
  useEffect(() => {
    if (cart && cart.items.length === 0 && !showPayment) navigate('/carrito')
  }, [cart, navigate, showPayment])

  const handleAddressChange = (e) =>
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await couponService.apply(couponCode.trim(), subtotal)
      setCoupon(res.data)
    } catch (err) {
      setCouponError(err.response?.data?.error || 'Cupón inválido')
      setCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }

  // Paso 1: validar formulario y avanzar a la pantalla de pago (sin llamada al backend)
  const handleSubmit = (e) => {
    e.preventDefault()
    setShowPayment(true)
  }

  // Datos del checkout para enviar al backend en cualquier método de pago
  const checkoutData = () => ({
    address,
    shippingCost:    shippingCost ?? 0,
    couponDiscount:  discount,
    notes:           coupon ? `Cupón: ${coupon.code}` : '',
  })

  // Paso 2a: ir a Mercado Pago
  const handleMercadoPago = async () => {
    setPayLoading(true)
    setError('')
    try {
      const { data: payment } = await paymentService.createPreference(checkoutData())
      window.location.href = payment.initPoint
    } catch (err) {
      setError(err.response?.data?.error || 'Error al conectar con Mercado Pago')
      setPayLoading(false)
    }
  }

  // Paso 2b: simular pago aprobado (demo)
  // La orden se crea aquí mismo en el backend, junto con el vaciado del carrito.
  const handleSimulate = async () => {
    setPayLoading(true)
    setError('')
    try {
      const { data } = await paymentService.simulate(checkoutData())
      await fetchCart()
      navigate(`/checkout/success?order=${data.orderId}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al simular el pago')
      setPayLoading(false)
    }
  }

  // Paso 2c: simular pago fallido — no crea ninguna orden ni toca el carrito
  const handleSimulateFailure = () => {
    navigate('/checkout/failure?status=rejected')
  }

  if (!cart) return null

  const subtotal              = cart.total ?? 0
  const discount              = coupon?.discount ?? 0
  const subtotalAfterDiscount = Math.max(0, subtotal - discount)
  const shippingCost          = calcShipping(address.state, subtotalAfterDiscount)
  const finalTotal            = subtotalAfterDiscount + (shippingCost ?? 0)

  return (
    <section className="min-h-screen bg-ivory/40 py-20">
      <div className="max-w-5xl mx-auto px-8">

        <button
          onClick={() => showPayment ? setShowPayment(false) : navigate('/carrito')}
          className="text-sm text-stone-400 hover:text-stone-700 transition inline-block mb-6"
        >
          ← {showPayment ? 'Volver al formulario' : 'Volver al carrito'}
        </button>
        <h1 className="text-3xl font-serifkr mb-10">Finalizar compra</h1>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-rose-50 text-rose-500 text-sm border border-rose-100">
            {error}
          </div>
        )}

        {/* ── PASO 2: selección de pago ── */}
        {showPayment ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-serifkr mb-1">Elegí cómo pagar</h2>
            <p className="text-stone-400 text-sm mb-8">Total a pagar: <span className="font-medium text-ink">${finalTotal.toLocaleString('es-AR')}</span></p>

            <div className="flex flex-col gap-3">
              {/* Mercado Pago */}
              <button
                onClick={handleMercadoPago}
                disabled={payLoading}
                className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-[#009ee3] hover:bg-[#008bc8] text-white font-medium transition disabled:opacity-50"
              >
                Pagar con Mercado Pago
              </button>

              {/* Separador */}
              <div className="flex items-center gap-3 my-1">
                <span className="flex-1 h-px bg-stone-100" />
                <span className="text-xs text-stone-300 uppercase tracking-widest">o</span>
                <span className="flex-1 h-px bg-stone-100" />
              </div>

              {/* Simular aprobado */}
              <button
                onClick={handleSimulate}
                disabled={payLoading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-dashed border-stone-300 text-stone-500 hover:border-green-300 hover:text-green-600 hover:bg-green-50 text-sm font-medium transition disabled:opacity-50"
              >
                {payLoading ? (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                Simular pago aprobado (demo)
              </button>

              {/* Simular fallido */}
              <button
                onClick={handleSimulateFailure}
                disabled={payLoading}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-dashed border-stone-300 text-stone-500 hover:border-rose-300 hover:text-rose-500 hover:bg-rose-50 text-sm font-medium transition disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Simular pago fallido (demo)
              </button>
            </div>
          </div>

        ) : (
          /* ── PASO 1: formulario ── */
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 order-2 lg:order-1">
              <AddressForm
                address={address}
                onChange={handleAddressChange}
                onSubmit={handleSubmit}
              />
            </div>

            <div className="lg:col-span-2 order-1 lg:order-2">
              <OrderSummary
                items={cart.items}
                subtotal={subtotal}
                discount={discount}
                shippingCost={shippingCost}
                finalTotal={finalTotal}
                coupon={coupon}
                couponCode={couponCode}
                onCouponChange={setCouponCode}
                onCouponApply={handleApplyCoupon}
                onCouponRemove={() => { setCoupon(null); setCouponCode(''); setCouponError('') }}
                couponLoading={couponLoading}
                couponError={couponError}
              />
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

