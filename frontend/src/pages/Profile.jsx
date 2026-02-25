import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth.store'
import { orderService } from '../services/api'
import {
    User,
    Mail,
    Phone,
    MapPin,
    ShoppingBag,
    Heart,
    LogOut,
    ChevronDown,
    ChevronUp,
    Pencil,
} from 'lucide-react'

export default function Profile() {
    const navigate = useNavigate()
    const { user, isAuthenticated, logout } = useAuthStore()
    const [orders, setOrders] = useState([])
    const [ordersOpen, setOrdersOpen] = useState(false)
    const [wishlistOpen, setWishlistOpen] = useState(false)
    const [loadingOrders, setLoadingOrders] = useState(false)


    const fetchOrders = async () => {
        if (orders.length > 0) return // ya cargados
        try {
            setLoadingOrders(true)
            const res = await orderService.getUserOrders()
            setOrders(res.data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingOrders(false)
        }
    }

    const handleToggleOrders = () => {
        if (!ordersOpen) fetchOrders()
        setOrdersOpen((prev) => !prev)
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    if (!user) return null

    // Iniciales del avatar
    const initials = user.name
        ?.split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    // Fecha de registro formateada
    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
        : null

    return (
        <div className="min-h-screen bg-stone-50 py-12">
            <div className="max-w-2xl mx-auto px-4 space-y-4">

                {/* Header de usuario */}
                <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-xl font-medium text-stone-600 shrink-0">
                        {initials}
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-stone-900">{user.name}</h1>
                        {memberSince && (
                            <p className="text-sm text-stone-400">Miembro desde {memberSince}</p>
                        )}
                    </div>
                </div>

                {/* Información personal */}
                <section className="bg-white rounded-2xl border border-stone-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-stone-900">Información personal</h2>
                        <button className="text-stone-400 hover:text-stone-700 transition" aria-label="Editar">
                            <Pencil size={16} strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <InfoRow icon={<User size={16} strokeWidth={1.5} />} label="Nombre" value={user.name} />
                        <InfoRow icon={<Mail size={16} strokeWidth={1.5} />} label="Email" value={user.email} />
                        <InfoRow icon={<Phone size={16} strokeWidth={1.5} />} label="Teléfono" value={user.phone ?? '—'} />
                        <InfoRow icon={<MapPin size={16} strokeWidth={1.5} />} label="Dirección" value={user.address ?? '—'} />
                    </div>
                </section>

                {/* Historial de compras */}
                <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <button
                        onClick={handleToggleOrders}
                        className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                    >
                        <span className="flex items-center gap-3">
                            <ShoppingBag size={16} strokeWidth={1.5} className="text-stone-400" />
                            Historial de compras
                        </span>
                        {ordersOpen ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
                    </button>

                    {ordersOpen && (
                        <div className="border-t border-stone-100 px-6 py-4">
                            {loadingOrders ? (
                                <p className="text-sm text-stone-400">Cargando...</p>
                            ) : orders.length === 0 ? (
                                <p className="text-sm text-stone-400">No tenés compras aún.</p>
                            ) : (
                        <div className="space-y-3">
                                    {orders.slice(0, 5).map((order) => (
                                        <div
                                            key={order._id}
                                            className="w-full flex items-center justify-between text-sm bg-stone-50 rounded-lg px-3 py-2.5"
                                        >
                                            <span className="text-stone-600">Orden #{order._id.slice(-6).toUpperCase()}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-stone-800">${order.total?.toLocaleString('es-AR')}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                    { processing: 'bg-green-100 text-green-700', preparing: 'bg-amber-100 text-amber-700', shipped: 'bg-blue-100 text-blue-700', delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-rose-100 text-rose-600' }[order.status] ?? 'bg-stone-100 text-stone-600'
                                                }`}>
                                                    {{ processing: 'Pago aprobado', preparing: 'En preparación', shipped: 'En camino', delivered: 'Entregado', cancelled: 'Cancelado' }[order.status] ?? order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => navigate('/orders')}
                                        className="w-full mt-1 text-xs text-stone-400 hover:text-stone-700 transition text-center py-2"
                                    >
                                        Ver todas mis órdenes →
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Lista de deseos */}
                <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <button
                        onClick={() => setWishlistOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                    >
                        <span className="flex items-center gap-3">
                            <Heart size={16} strokeWidth={1.5} className="text-stone-400" />
                            Lista de deseos
                        </span>
                        {wishlistOpen ? <ChevronUp size={16} className="text-stone-400" /> : <ChevronDown size={16} className="text-stone-400" />}
                    </button>

                    {wishlistOpen && (
                        <div className="border-t border-stone-100 px-6 py-4">
                            <p className="text-sm text-stone-400">Próximamente disponible.</p>
                        </div>
                    )}
                </section>

                {/* Cerrar sesión */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-stone-200 rounded-2xl py-4 text-sm text-stone-600 hover:bg-stone-50 transition"
                >
                    <LogOut size={16} strokeWidth={1.5} />
                    Cerrar sesión
                </button>

            </div>
        </div>
    )
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <span className="text-stone-400 mt-0.5 shrink-0">{icon}</span>
            <div>
                <p className="text-xs text-stone-400">{label}</p>
                <p className="text-sm text-stone-800">{value}</p>
            </div>
        </div>
    )
}
