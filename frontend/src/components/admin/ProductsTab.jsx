import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import { productService } from '../../services/api'
import { CATEGORIES } from './constants'
import Toggle from './Toggle'
import ProductModal from './ProductModal'
import { FilterSearch, FilterSort, FilterPills } from './FilterBar'

// ─── PRODUCTS TAB ─────────────────────────────────────────────────────────────

export default function ProductsTab() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [filterCat, setFilterCat] = useState('Todos')
    const [filterStatus, setFilterStatus] = useState('todos')
    const [sort, setSort] = useState('newest')
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 10

    const SORT_OPTIONS = [
        { value: 'newest',    label: 'Más reciente' },
        { value: 'oldest',    label: 'Más antiguo' },
        { value: 'name_asc',  label: 'Nombre A → Z' },
        { value: 'name_desc', label: 'Nombre Z → A' },
        { value: 'featured',  label: 'Destacados primero' },
    ]

    const STATUS_OPTIONS = [
        { value: 'todos',    label: 'Todos' },
        { value: 'active',   label: 'Activos',   activeClass: 'bg-sage text-white' },
        { value: 'inactive', label: 'Inactivos', activeClass: 'bg-rose-400 text-white' },
    ]

    const CAT_OPTIONS = ['Todos', ...CATEGORIES].map(c => ({ value: c, label: c }))

    const load = async () => {
        setLoading(true)
        try { const res = await productService.getAdminAll(); setProducts(res.data) }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const handleDelete = async (id) => {
        await productService.delete(id)
        setDeleteId(null)
        load()
    }

    const handleToggle = async (p, field) => {
        if (field === 'featured' && !p.active) return
        const update = { [field]: !p[field] }
        if (field === 'active' && p[field]) update.featured = false
        await productService.update(p._id, update)
        load()
    }

    const changeFilter = (val, type) => {
        setPage(1)
        if (type === 'cat') setFilterCat(val)
        else if (type === 'status') setFilterStatus(val)
        else setSearch(val)
    }

    const visible = products
        .filter(p => {
            const matchCat    = filterCat === 'Todos' || p.category === filterCat
            const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
            const matchStatus =
                filterStatus === 'todos'    ? true :
                filterStatus === 'active'   ? p.active :  !p.active
            return matchCat && matchSearch && matchStatus
        })
        .sort((a, b) => {
            if (sort === 'newest')    return new Date(b.createdAt) - new Date(a.createdAt)
            if (sort === 'oldest')    return new Date(a.createdAt) - new Date(b.createdAt)
            if (sort === 'name_asc')  return a.name.localeCompare(b.name)
            if (sort === 'name_desc') return b.name.localeCompare(a.name)
            if (sort === 'featured')  return (b.featured && b.active ? 1 : 0) - (a.featured && a.active ? 1 : 0)
            return 0
        })

    const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
    const paged = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-semibold text-ink">Productos ({visible.length})</h2>
                <button
                    onClick={() => setModal('new')}
                    className="flex items-center gap-2 bg-sage text-white px-4 py-2 rounded-full text-sm hover:bg-sage/90 transition self-start"
                >
                    <Plus size={15} /> Agregar producto
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3 mb-5">
                <div className="flex flex-col sm:flex-row gap-3">
                    <FilterSearch value={search} onChange={v => changeFilter(v, 'search')} placeholder="Buscar por nombre..." />
                    <FilterSort value={sort} onChange={v => { setSort(v); setPage(1) }} options={SORT_OPTIONS} />
                </div>
                <FilterPills value={filterCat} onChange={v => changeFilter(v, 'cat')} options={CAT_OPTIONS} />
                <FilterPills value={filterStatus} onChange={v => changeFilter(v, 'status')} options={STATUS_OPTIONS} />
            </div>

            {loading ? (
                <p className="text-stone-400 text-sm">Cargando...</p>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-stone-50 border-b border-stone-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Producto</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Categoría</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Precio</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Stock</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Destacado</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase">Activo</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50">
                                {visible.map(p => {
                                    const isFeatured = p.featured && p.active
                                    return (
                                    <tr key={p._id} className={`hover:bg-stone-50 transition ${isFeatured ? 'bg-amber-50/40' : ''}`}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-stone-100" onError={e => { e.target.style.display = 'none' }} />
                                                <div>
                                                    <p className="font-medium text-ink">{p.name}</p>
                                                    {isFeatured && <span className="text-xs text-amber-600 font-medium">⭐ Destacado</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-stone-500">{p.category}</td>
                                        <td className="px-4 py-3 text-stone-700 font-medium">${p.price?.toLocaleString('es-AR')}</td>
                                        <td className="px-4 py-3 text-stone-500">{p.stock}</td>
                                        <td className="px-4 py-3">
                                            <Toggle checked={isFeatured} onChange={() => handleToggle(p, 'featured')} colorOn="bg-amber-400" disabled={!p.active} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Toggle checked={p.active} onChange={() => handleToggle(p, 'active')} />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {deleteId === p._id ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <span className="text-xs text-stone-500">¿Eliminar?</span>
                                                    <button onClick={() => handleDelete(p._id)} className="text-rose-500 hover:text-rose-700"><Check size={16} /></button>
                                                    <button onClick={() => setDeleteId(null)} className="text-stone-400 hover:text-stone-600"><X size={16} /></button>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-3">
                                                    <button onClick={() => setModal(p)} className="text-stone-400 hover:text-ink transition"><Pencil size={16} /></button>
                                                    <button onClick={() => setDeleteId(p._id)} className="text-stone-400 hover:text-rose-500 transition"><Trash2 size={16} /></button>
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                    )
                                })}
                                {visible.length === 0 && (
                                    <tr><td colSpan={7} className="px-4 py-8 text-center text-stone-400 text-sm">Sin resultados</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {modal && (
                <ProductModal
                    product={modal === 'new' ? null : modal}
                    onClose={() => setModal(null)}
                    onSaved={load}
                />
            )}
        </div>
    )
}
