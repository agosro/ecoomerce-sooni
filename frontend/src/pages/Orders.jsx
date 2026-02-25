import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth.store'
import { orderService } from '../services/api'
import OrderCard from '../components/orders/OrderCard'

export default function Orders() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [isAuthenticated, navigate])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.getUserOrders()
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory/40 flex items-center justify-center text-stone-400 text-sm">
        Cargando órdenes...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory/40 py-20">
      <div className="max-w-3xl mx-auto px-8">
        <h1 className="text-3xl font-serifkr mb-10">Mis órdenes</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-stone-400 mb-6">No tenés órdenes aún</p>
            <button
              onClick={() => navigate('/productos')}
              className="bg-sage text-white py-2.5 px-8 rounded-full font-medium hover:bg-sage/90 transition"
            >
              Ir a comprar
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
