import { useRef, useState } from 'react'
import { X, ImagePlus } from 'lucide-react'
import { productService, uploadService } from '../../services/api'
import { CATEGORIES, EMPTY_PRODUCT, FIELD, LABEL } from './constants'
import Toggle from './Toggle'

// ─── PRODUCT MODAL ────────────────────────────────────────────────────────────

export default function ProductModal({ product, onClose, onSaved }) {
    const [form, setForm] = useState(product || EMPTY_PRODUCT)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [imgFile, setImgFile] = useState(null)
    const [imgPreview, setImgPreview] = useState(product?.imageUrl || null)
    const fileRef = useRef()

    const handle = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleFile = (file) => {
        if (!file) return
        setImgFile(file)
        setImgPreview(URL.createObjectURL(file))
    }

    const onDrop = (e) => {
        e.preventDefault()
        handleFile(e.dataTransfer.files[0])
    }

    const submit = async (e) => {
        e.preventDefault()
        if (!imgPreview) { setError('Seleccioná una imagen'); return }
        setSaving(true)
        setError('')
        try {
            let imageUrl = form.imageUrl
            if (imgFile) {
                const res = await uploadService.image(imgFile)
                imageUrl = res.data.url
            }
            const payload = { ...form, price: Number(form.price), stock: Number(form.stock), imageUrl }
            if (product?._id) {
                await productService.update(product._id, payload)
            } else {
                await productService.create(payload)
            }
            onSaved()
            onClose()
        } catch (err) {
            setError(err.response?.data?.error || 'Error al guardar')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                    <h3 className="font-semibold text-ink">{product ? 'Editar producto' : 'Nuevo producto'}</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-ink transition"><X size={18} /></button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    {error && <p className="text-rose-500 text-sm">{error}</p>}

                    {/* Image picker */}
                    <div>
                        <label className={LABEL}>Imagen del producto</label>
                        <div
                            onClick={() => fileRef.current.click()}
                            onDrop={onDrop}
                            onDragOver={e => e.preventDefault()}
                            className="relative cursor-pointer border-2 border-dashed border-stone-200 rounded-xl overflow-hidden hover:border-stone-400 transition"
                        >
                            {imgPreview ? (
                                <img src={imgPreview} alt="preview" className="w-full h-44 object-contain bg-stone-50 p-2" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-44 text-stone-300 gap-2">
                                    <ImagePlus size={32} strokeWidth={1} />
                                    <p className="text-xs">Click o arrastre una imagen</p>
                                    <p className="text-xs">JPG, PNG, WEBP — máx. 5 MB</p>
                                </div>
                            )}
                            {imgPreview && (
                                <button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); setImgFile(null); setImgPreview(null); setForm(f => ({ ...f, imageUrl: '' })) }}
                                    className="absolute top-2 right-2 bg-black/40 text-white rounded-full p-1 hover:bg-black/60 transition"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={e => handleFile(e.target.files[0])}
                        />
                    </div>

                    <div>
                        <label className={LABEL}>Nombre</label>
                        <input name="name" value={form.name} onChange={handle} required placeholder="Nombre del producto" className={FIELD} />
                    </div>

                    <div>
                        <label className={LABEL}>Descripción</label>
                        <textarea name="description" value={form.description} onChange={handle} required rows={3} placeholder="Descripción" className={FIELD + ' resize-none'} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL}>Precio (ARS)</label>
                            <input name="price" type="number" min="0" value={form.price} onChange={handle} required placeholder="0" className={FIELD} />
                        </div>
                        <div>
                            <label className={LABEL}>Stock</label>
                            <input name="stock" type="number" min="0" value={form.stock} onChange={handle} required placeholder="0" className={FIELD} />
                        </div>
                    </div>

                    <div>
                        <label className={LABEL}>Categoría</label>
                        <select name="category" value={form.category} onChange={handle} className={FIELD}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-8 pt-1">
                        <Toggle checked={form.featured} onChange={v => setForm(f => ({ ...f, featured: v }))} label="Destacado" colorOn="bg-amber-400" />
                        <Toggle checked={form.active} onChange={v => setForm(f => ({ ...f, active: v }))} label="Activo" />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-sm rounded-full border border-stone-200 text-stone-500 hover:bg-stone-50 transition">
                            Cancelar
                        </button>
                        <button type="submit" disabled={saving} className="px-5 py-2 text-sm rounded-full bg-sage text-white hover:bg-sage/90 disabled:opacity-50 transition">
                            {saving ? 'Subiendo...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
