import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth.store'
import { orderService, authService } from '../services/api'
import { SHIPPING_RATES } from '../data/shippingRates'
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
    const { user, isAuthenticated, logout, updateUser } = useAuthStore()
    const [profile, setProfile] = useState(null)
    const [orders, setOrders] = useState([])
    const [ordersOpen, setOrdersOpen] = useState(false)
    const [wishlistOpen, setWishlistOpen] = useState(false)
    const [loadingOrders, setLoadingOrders] = useState(false)
    const [editing, setEditing] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [form, setForm] = useState({ name: '', phone: '', street: '', city: '', state: '', zipCode: '' })

    // Cargar perfil fresco desde el backend
    useEffect(() => {
        authService.getProfile()
            .then(({ data }) => {
                setProfile(data)
                setForm({
                    name:    data.name    ?? '',
                    phone:   data.phone   ?? '',
                    street:  data.savedAddress?.street  ?? '',
                    city:    data.savedAddress?.city    ?? '',
                    state:   data.savedAddress?.state   ?? '',
                    zipCode: data.savedAddress?.zipCode ?? '',
                })
            })
            .catch(() => {})
    }, [])

    const currentUser = profile ?? user


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

    const handleFormChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSave = async () => {
        setSaveLoading(true)
        setSaveError('')
        try {
            const { data } = await authService.updateProfile(form)
            setProfile(data)
            updateUser(data)
            setEditing(false)
        } catch (err) {
            setSaveError(err.response?.data?.error || 'Error al guardar los cambios')
        } finally {
            setSaveLoading(false)
        }
    }

    const handleCancelEdit = () => {
        setForm({
            name:    currentUser?.name    ?? '',
            phone:   currentUser?.phone   ?? '',
            street:  currentUser?.savedAddress?.street  ?? '',
            city:    currentUser?.savedAddress?.city    ?? '',
            state:   currentUser?.savedAddress?.state   ?? '',
            zipCode: currentUser?.savedAddress?.zipCode ?? '',
        })
        setSaveError('')
        setEditing(false)
    }

    if (!currentUser) return null

    // Iniciales del avatar
    const initials = currentUser.name
        ?.split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    // Fecha de registro formateada
    const memberSince = currentUser.createdAt
        ? new Date(currentUser.createdAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
        : null

    const sa = currentUser.savedAddress
    const addressDisplay = sa?.street
        ? `${sa.street}, ${sa.city}${sa.state ? `, ${sa.state}` : ''}${sa.zipCode ? ` (${sa.zipCode})` : ''}`
        : '—'

    return (
        <div className="min-h-screen bg-stone-50 py-12">
            <div className="max-w-2xl mx-auto px-4 space-y-4">

                {/* Header de usuario */}
                <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-xl font-medium text-stone-600 shrink-0">
                        {initials}
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-stone-900">{currentUser.name}</h1>
                        {memberSince && (
                            <p className="text-sm text-stone-400">Miembro desde {memberSince}</p>
                        )}
                    </div>
                </div>

                {/* Información personal */}
                <section className="bg-white rounded-2xl border border-stone-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-stone-900">Información personal</h2>
                        {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className="text-stone-400 hover:text-stone-700 transition"
                                aria-label="Editar"
                            >
                                <Pencil size={16} strokeWidth={1.5} />
                            </button>
                        )}
                    </div>

                    {editing ? (
                        <div className="space-y-4">
                            {saveError && (
                                <p className="text-xs text-rose-500 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{saveError}</p>
                            )}
                            <EditField label="Nombre" name="name" value={form.name} onChange={handleFormChange} />
                            <EditField label="Teléfono" name="phone" value={form.phone} onChange={handleFormChange} placeholder="Ej: +54 9 351 000-0000" />
                            <div className="pt-1">
                                <p className="text-xs text-stone-400 mb-2 flex items-center gap-1.5">
                                    <MapPin size={13} strokeWidth={1.5} /> Dirección de envío
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <EditField label="Calle y número" name="street" value={form.street} onChange={handleFormChange} placeholder="Av. Corrientes 1234" />
                                    <EditField label="Ciudad" name="city" value={form.city} onChange={handleFormChange} placeholder="Córdoba" />
                                    <div>
                                        <p className="text-xs text-stone-400 mb-1">Provincia</p>
                                        <select
                                            name="state"
                                            value={form.state}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 focus:outline-none focus:border-stone-400 transition"
                                        >
                                            <option value="">Seleccioná...</option>
                                            {SHIPPING_RATES.map(r => (
                                                <option key={r.province} value={r.province}>{r.province}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <EditField label="Código postal" name="zipCode" value={form.zipCode} onChange={handleFormChange} placeholder="5000" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleSave}
                                    disabled={saveLoading}
                                    className="flex-1 bg-sage text-white py-2.5 rounded-full text-sm font-medium hover:bg-sage/90 transition disabled:opacity-50"
                                >
                                    {saveLoading ? 'Guardando…' : 'Guardar cambios'}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={saveLoading}
                                    className="flex-1 border border-stone-200 text-stone-500 py-2.5 rounded-full text-sm font-medium hover:bg-stone-50 transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <InfoRow icon={<User size={16} strokeWidth={1.5} />} label="Nombre" value={currentUser.name} />
                            <InfoRow icon={<Mail size={16} strokeWidth={1.5} />} label="Email" value={currentUser.email} />
                            <InfoRow icon={<Phone size={16} strokeWidth={1.5} />} label="Teléfono" value={currentUser.phone || '—'} />
                            <InfoRow icon={<MapPin size={16} strokeWidth={1.5} />} label="Dirección" value={addressDisplay} />
                        </div>
                    )}
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

function EditField({ label, name, value, onChange, placeholder }) {
    return (
        <div>
            <p className="text-xs text-stone-400 mb-1">{label}</p>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 transition"
            />
        </div>
    )
}
