import { useEffect, useState } from 'react'
import { Plus, Trash2, Check, X, Tag } from 'lucide-react'
import { categoryService } from '../../services/api'
import { FIELD, LABEL } from './constants'

export default function CategoriesTab() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [newName, setNewName] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [deleteId, setDeleteId] = useState(null)

    const load = async () => {
        setLoading(true)
        try { const res = await categoryService.getAll(); setCategories(res.data) }
        finally { setLoading(false) }
    }

    useEffect(() => { load() }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!newName.trim()) return
        setSaving(true)
        setError('')
        try {
            await categoryService.create(newName)
            setNewName('')
            load()
        } catch (err) {
            setError(err.response?.data?.error || 'Error al crear la categoría')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        try {
            await categoryService.delete(id)
            setDeleteId(null)
            load()
        } catch (err) {
            setDeleteId(null)
            setError(err.response?.data?.error || 'Error al eliminar la categoría')
        }
    }

    return (
        <div className="max-w-lg">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-ink">Categorías ({categories.length})</h2>
            </div>

            {/* Formulario crear */}
            <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-stone-100 p-5 mb-6">
                <label className={LABEL}>Nueva categoría</label>
                <div className="flex gap-2 mt-1">
                    <input
                        type="text"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        placeholder="Ej: Mascarillas"
                        className={FIELD}
                    />
                    <button
                        type="submit"
                        disabled={saving || !newName.trim()}
                        className="flex items-center gap-1 px-4 py-2 bg-sage text-white rounded-lg text-sm hover:bg-sage/90 disabled:opacity-50 transition whitespace-nowrap"
                    >
                        <Plus size={15} /> Agregar
                    </button>
                </div>
                {error && <p className="text-rose-500 text-xs mt-2">{error}</p>}
            </form>

            {/* Lista */}
            {loading ? (
                <p className="text-stone-400 text-sm">Cargando...</p>
            ) : categories.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-100 p-8 text-center">
                    <Tag size={32} className="mx-auto text-stone-300 mb-2" />
                    <p className="text-stone-400 text-sm">No hay categorías creadas</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                    <ul className="divide-y divide-stone-50">
                        {categories.map(cat => (
                            <li key={cat._id} className="flex items-center justify-between px-5 py-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-ink font-medium">{cat.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        cat.productCount > 0 ? 'bg-stone-100 text-stone-500' : 'bg-stone-50 text-stone-300'
                                    }`}>
                                        {cat.productCount} producto{cat.productCount !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                {deleteId === cat._id ? (
                                    <span className="inline-flex items-center gap-2">
                                        <span className="text-xs text-stone-500">¿Eliminar?</span>
                                        <button onClick={() => handleDelete(cat._id)} className="text-rose-500 hover:text-rose-700"><Check size={16} /></button>
                                        <button onClick={() => setDeleteId(null)} className="text-stone-400 hover:text-stone-600"><X size={16} /></button>
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => setDeleteId(cat._id)}
                                        disabled={cat.productCount > 0}
                                        title={cat.productCount > 0 ? `No se puede eliminar: ${cat.productCount} producto${cat.productCount !== 1 ? 's' : ''} la usan` : 'Eliminar categoría'}
                                        className="text-rose-400 hover:text-rose-600 transition disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:text-rose-400"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
