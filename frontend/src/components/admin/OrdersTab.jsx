import { useEffect, useState } from 'react'
import { orderService } from '../../services/api'
import { STATUS_LABEL, STATUS_COLOR } from './constants'

// Flujo lineal de estados
const NEXT_STATUS = {
    processing: 'preparing',
    preparing:  'shipped',
    shipped:    'delivered',
}

const NEXT_LABEL = {
    processing: 'Marcar en preparación',
    preparing:  'Marcar en camino',
    shipped:    'Marcar como entregado',
}

// ─── FILA EXPANDIBLE ──────────────────────────────────────────────────────────
function OrderRow({ order, onStatusChange }) {
    const [open, setOpen] = useState(false)
    const [confirming, setConfirming] = useState(null) // 'next' | 'cancel'
    const [saving, setSaving] = useState(false)
    const addr = order.shippingAddress
    const subtotal = (order.total ?? 0) + (order.discount ?? 0) - (order.shippingCost ?? 0)

    const isFinal = order.status === 'delivered' || order.status === 'cancelled'
    const nextStatus = NEXT_STATUS[order.status]

    const handleConfirm = async (status) => {
        setSaving(true)
        await onStatusChange(order._id, status)
        setConfirming(null)
        setSaving(false)
    }

    return (
        <>
            {/* ── fila principal ── */}
            <tr
                onClick={() => !confirming && setOpen(v => !v)}
                className="hover:bg-stone-50 transition cursor-pointer"
            >
                <td className="px-4 py-3 font-mono text-xs text-stone-400">
                    <span className="flex items-center gap-1.5">
                        <svg
                            className={`w-3 h-3 text-stone-300 transition-transform ${open ? 'rotate-90' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {order._id.slice(-8).toUpperCase()}
                    </span>
                </td>
                <td className="px-4 py-3">
                    <p className="text-ink font-medium text-sm">{order.userId?.name || '—'}</p>
                    <p className="text-stone-400 text-xs">{order.userId?.email || ''}</p>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-stone-700">
                    ${order.total?.toLocaleString('es-AR')}
                </td>
                <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[order.status]}`}>
                        {STATUS_LABEL[order.status]}
                    </span>
                </td>
                <td className="px-4 py-3 text-stone-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                </td>

                {/* ── Acciones ── */}
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    {isFinal ? (
                        <span className="text-xs text-stone-300">—</span>
                    ) : confirming ? (
                        /* mini confirmación inline */
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-500">
                                {confirming === 'next'
                                    ? `¿Pasar a "${STATUS_LABEL[nextStatus]}"?`
                                    : '¿Cancelar orden?'}
                            </span>
                            <button
                                onClick={() => handleConfirm(confirming === 'next' ? nextStatus : 'cancelled')}
                                disabled={saving}
                                className="text-xs px-2 py-1 rounded-lg bg-ink text-white hover:bg-ink/80 disabled:opacity-50 transition"
                            >
                                {saving ? '...' : 'Sí'}
                            </button>
                            <button
                                onClick={() => setConfirming(null)}
                                className="text-xs px-2 py-1 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-100 transition"
                            >
                                No
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* botón siguiente paso */}
                            {nextStatus && (
                                <button
                                    onClick={() => setConfirming('next')}
                                    className="text-xs px-2.5 py-1 rounded-lg bg-sage text-white hover:bg-sage/80 transition whitespace-nowrap"
                                >
                                    {NEXT_LABEL[order.status]} →
                                </button>
                            )}
                            {/* botón cancelar */}
                            <button
                                onClick={() => setConfirming('cancel')}
                                className="text-xs px-2 py-1 rounded-lg border border-rose-200 text-rose-400 hover:bg-rose-50 transition"
                                title="Cancelar orden"
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </td>
            </tr>

            {/* ── panel expandido ── */}
            {open && (
                <tr>
                    <td colSpan={6} className="px-0 py-0">
                        <div className="bg-stone-50 border-t border-b border-stone-100 px-6 py-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

                            {/* Productos */}
                            <div>
                                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Productos</p>
                                <div className="space-y-2">
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between">
                                            <span className="text-stone-700">
                                                {item.productName || 'Producto'}
                                                <span className="text-stone-400 ml-1">×{item.quantity}</span>
                                            </span>
                                            <span className="text-stone-600 font-medium">
                                                ${(item.price * item.quantity).toLocaleString('es-AR')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 pt-3 border-t border-stone-200 space-y-1">
                                    <div className="flex justify-between text-stone-500 text-xs">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toLocaleString('es-AR')}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-green-600 text-xs">
                                            <span>Descuento</span>
                                            <span>−${order.discount.toLocaleString('es-AR')}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-stone-500 text-xs">
                                        <span>Envío</span>
                                        <span>{order.shippingCost > 0 ? `$${order.shippingCost.toLocaleString('es-AR')}` : 'Gratis'}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-stone-800 text-xs pt-1 border-t border-stone-200">
                                        <span>Total</span>
                                        <span>${order.total?.toLocaleString('es-AR')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dirección de envío */}
                            <div>
                                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Dirección de envío</p>
                                {addr && (addr.street || addr.city) ? (
                                    <div className="space-y-0.5 text-stone-600">
                                        {addr.street  && <p>{addr.street}</p>}
                                        {(addr.city || addr.state) && <p>{[addr.city, addr.state].filter(Boolean).join(', ')}</p>}
                                        {(addr.zipCode || addr.country) && <p className="text-stone-400 text-xs">{[addr.zipCode, addr.country].filter(Boolean).join(' · ')}</p>}
                                    </div>
                                ) : (
                                    <p className="text-stone-400 text-xs">Sin dirección registrada</p>
                                )}
                                {order.notes && (
                                    <div className="mt-3">
                                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1">Notas</p>
                                        <p className="text-stone-500 text-xs">{order.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Historial de estados */}
                            <div>
                                <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">Historial</p>
                                {order.statusHistory?.length > 0 ? (
                                    <ol className="space-y-2">
                                        {order.statusHistory.map((entry, i) => (
                                            <li key={i} className="flex gap-2 items-start">
                                                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold
                                                    ${{ processing: 'bg-green-100 text-green-600', preparing: 'bg-amber-100 text-amber-600', shipped: 'bg-blue-100 text-blue-600', delivered: 'bg-emerald-100 text-emerald-600', cancelled: 'bg-rose-100 text-rose-500' }[entry.status] ?? 'bg-stone-100 text-stone-400'}`}>
                                                    {i + 1}
                                                </span>
                                                <div>
                                                    <p className="text-stone-700 text-xs font-medium leading-tight">{STATUS_LABEL[entry.status] || entry.status}</p>
                                                    <p className="text-stone-400 text-xs">
                                                        {new Date(entry.changedAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        {' · '}
                                                        {new Date(entry.changedAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <p className="text-stone-400 text-xs">Sin historial aún</p>
                                )}
                            </div>

                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}

// ─── ORDERS TAB ───────────────────────────────────────────────────────────────
export default function OrdersTab() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const load = async () => {
        setLoading(true)
        try { const res = await orderService.getAll(); setOrders(res.data) }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const handleStatus = async (id, status) => {
        await orderService.updateStatus(id, status)
        load()
    }

    return (
        <div>
            <h2 className="text-lg font-semibold text-ink mb-6">Órdenes ({orders.length})</h2>

            {loading ? (
                <p className="text-stone-400 text-sm">Cargando...</p>
            ) : orders.length === 0 ? (
                <p className="text-stone-400 text-sm">No hay órdenes aún.</p>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-stone-50 border-b border-stone-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Cliente</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Estado</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Fecha</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {orders.map(order => (
                                    <OrderRow key={order._id} order={order} onStatusChange={handleStatus} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

