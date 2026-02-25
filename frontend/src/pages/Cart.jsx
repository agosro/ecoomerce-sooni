import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import useAuthStore from '../store/auth.store'

// Resuelve el ID de producto independientemente de si está populado o no
const resolveProductId = (item) =>
  item.productId?._id?.toString() ?? item.productId?.toString()

export default function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { cart, removeItem, updateItem, clearCart } = useCart()

  const handleCheckout = () => {
    if (!isAuthenticated) { navigate('/setup'); return }
    navigate('/checkout')
  }

  if (!cart || cart.items.length === 0) {
    return (
      <section className="py-32 bg-ivory text-center">
        <h2 className="text-2xl font-medium mb-4">
          Tu carrito está vacío
        </h2>
        <Link
          to="/productos"
          className="bg-sage text-white px-8 py-3 rounded-full inline-block"
        >
          Ver productos
        </Link>
      </section>
    )
  }

  return (
    <section className="py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-8">
        <Link
          to="/productos"
          className="text-sm text-ink/60 mb-6 inline-block hover:text-ink transition"
        >
          ← Continuar comprando
        </Link>

        <div className="flex flex-col items-start gap-2 mb-10">
          <h1 className="text-3xl font-serifkr">
            Tu carrito
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-stone-400 hover:text-red-500 transition"
          >
            Vaciar carrito
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT - Productos */}
          <div className="lg:col-span-2 space-y-6">
            {cart.items.map((item) => {
              const pid = resolveProductId(item)
              return (
              <div
                key={item._id}
                className="bg-white rounded-2xl p-6 flex gap-6 items-center shadow-sm"
              >
                {/* Imagen */}
                <img
                  src={item.productId?.imageUrl || 'https://via.placeholder.com/96'}
                  alt={item.productId?.name || 'Producto'}
                  className="w-24 h-24 rounded-xl object-cover"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-medium">
                    {item.productId?.name || 'Producto'}
                  </h3>
                  <p className="text-sm text-ink/60">
                    {item.productId?.category || 'Skincare'}
                  </p>

                  {/* Stepper */}
                  <div className="mt-3 flex items-center border border-ink/20 rounded-full w-fit">
                    <button
                      onClick={() => updateItem(pid, Math.max(0, item.quantity - 1))}
                      className="px-3 py-2 rounded-full hover:bg-gray-100 transition"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="px-4 text-sm">{item.quantity}</span>

                    <button
                      onClick={() => updateItem(pid, item.quantity + 1)}
                      className="px-3 py-2 rounded-full hover:bg-gray-100 transition"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Precio */}
                <div className="text-right">
                  <p className="font-medium">
                    ${(item.price * item.quantity).toLocaleString('es-AR')}
                  </p>

                  <button
                    onClick={() => removeItem(pid)}
                    className="text-ink/50 hover:text-red-500 mt-2 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              )
            })}
          </div>

          {/* RIGHT - Resumen */}
          <div className="bg-white rounded-2xl p-8 shadow-sm h-fit sticky top-24">
            <h3 className="font-medium mb-6">
              Resumen del pedido
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span>${cart.total.toLocaleString('es-AR')}</span>
              </div>

              <div className="flex justify-between text-stone-500">
                <span>Envío</span>
                <span className="text-stone-400 italic text-xs">Se calcula al elegir provincia</span>
              </div>

              <hr className="my-4 border-stone-200" />

              <div className="flex justify-between text-stone-700 font-medium">
                <span>Total estimado</span>
                <span>${cart.total.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-sage text-white py-3 rounded-full font-medium hover:bg-sage/90 transition"
            >
              Finalizar compra
            </button>

            <p className="text-xs text-ink/50 mt-4 text-center">
              Envío gratis en pedidos mayores a $100.000
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
