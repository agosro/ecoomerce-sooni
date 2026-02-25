import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { couponService } from '../../services/api'
import CouponModal from './CouponModal'
import { FilterSearch, FilterSort, FilterPills } from './FilterBar'

// ─── COUPONS TAB ──────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
    { value: 'newest',      label: 'Más reciente' },
    { value: 'oldest',      label: 'Más antiguo' },
    { value: 'code_asc',    label: 'Código A → Z' },
    { value: 'code_desc',   label: 'Código Z → A' },
    { value: 'expiring',    label: 'Próximos a vencer' },
]

const STATUS_OPTIONS = [
    { value: 'todos',    label: 'Todos' },
    { value: 'active',   label: 'Activos',   activeClass: 'bg-sage text-white' },
    { value: 'inactive', label: 'Inactivos', activeClass: 'bg-rose-400 text-white' },
]

export default function CouponsTab() {
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('newest')
    const [filterStatus, setFilterStatus] = useState('todos')

    const load = async () => {
        setLoading(true)
        try { const res = await couponService.getAll(); setCoupons(res.data) }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const handleDelete = async (id) => {
        await couponService.delete(id)
        setDeleteId(null)
        load()
    }

    const visible = coupons
        .filter(c => {
            const matchSearch = !search || c.code.toLowerCase().includes(search.toLowerCase())
            const matchStatus =
                filterStatus === 'todos'    ? true :
                filterStatus === 'active'   ? c.active : !c.active
            return matchSearch && matchStatus
        })
        .sort((a, b) => {
            if (sort === 'newest')    return new Date(b.createdAt) - new Date(a.createdAt)
            if (sort === 'oldest')    return new Date(a.createdAt) - new Date(b.createdAt)
            if (sort === 'code_asc')  return a.code.localeCompare(b.code)
            if (sort === 'code_desc') return b.code.localeCompare(a.code)
            if (sort === 'expiring') {
                const da = a.expiresAt ? new Date(a.expiresAt) : new Date('9999')
                const db = b.expiresAt ? new Date(b.expiresAt) : new Date('9999')
                return da - db
            }
            return 0
        })

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-ink">Cupones ({visible.length})</h2>
                <button
                    onClick={() => setModal('new')}
                    className="flex items-center gap-2 bg-sage text-white px-4 py-2 rounded-full text-sm hover:bg-sage/90 transition"
                >
                    <Plus size={15} /> Nuevo cupón
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 mb-5">
                <div className="flex flex-col sm:flex-row gap-3">
                    <FilterSearch value={search} onChange={setSearch} placeholder="Buscar por código..." />
                    <FilterSort value={sort} onChange={setSort} options={SORT_OPTIONS} />
                </div>
                <FilterPills value={filterStatus} onChange={setFilterStatus} options={STATUS_OPTIONS} />
            </div>

            {loading ? (
                <p className="text-stone-400 text-sm">Cargando...</p>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-stone-50 border-b border-stone-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Código</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Descuento</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Mín. pedido</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Usos</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Vence</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Estado</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {visible.map(c => (
                                    <tr key={c._id} className="hover:bg-stone-50 transition">
                                        <td className="px-4 py-3 font-mono font-medium text-ink">{c.code}</td>
                                        <td className="px-4 py-3 text-stone-700">
                                            {c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue.toLocaleString('es-AR')}`}
                                        </td>
                                        <td className="px-4 py-3 text-stone-500">
                                            {c.minOrderAmount ? `$${c.minOrderAmount.toLocaleString('es-AR')}` : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-stone-500">
                                            {c.maxUses ? `${c.usedCount}/${c.maxUses}` : `${c.usedCount} / ∞`}
                                        </td>
                                        <td className="px-4 py-3 text-stone-400 text-xs">
                                            {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('es-AR') : 'Sin venc.'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${c.active ? 'bg-sage/15 text-sage' : 'bg-stone-100 text-stone-400'}`}>
                                                {c.active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {deleteId === c._id ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <span className="text-xs text-stone-500">¿Eliminar?</span>
                                                    <button onClick={() => handleDelete(c._id)} className="text-rose-500 hover:text-rose-700"><Check size={16} /></button>
                                                    <button onClick={() => setDeleteId(null)} className="text-stone-400 hover:text-stone-600"><X size={16} /></button>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-3">
                                                    <button onClick={() => setModal(c)} className="text-stone-400 hover:text-ink transition"><Pencil size={16} /></button>
                                                    <button onClick={() => setDeleteId(c._id)} className="text-stone-400 hover:text-rose-500 transition"><Trash2 size={16} /></button>
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {visible.length === 0 && (
                                    <tr><td colSpan={7} className="px-4 py-8 text-center text-stone-400 text-sm">No hay cupones creados</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {modal && (
                <CouponModal
                    coupon={modal === 'new' ? null : modal}
                    onClose={() => setModal(null)}
                    onSaved={load}
                />
            )}
        </div>
    )
}
