import { X } from 'lucide-react'
import { couponService } from '../../services/api'
import { EMPTY_COUPON, FIELD, LABEL } from './constants'
import Toggle from './Toggle'
import { useState } from 'react'

// ─── COUPON MODAL ─────────────────────────────────────────────────────────────

export default function CouponModal({ coupon, onClose, onSaved }) {
    const [form, setForm] = useState(coupon || EMPTY_COUPON)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const handle = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const submit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        try {
            const payload = {
                ...form,
                code: form.code.toUpperCase(),
                discountValue: Number(form.discountValue),
                minOrderAmount: Number(form.minOrderAmount) || 0,
                maxUses: form.maxUses ? Number(form.maxUses) : null,
                expiresAt: form.expiresAt || null,
            }
            if (coupon?._id) {
                await couponService.update(coupon._id, payload)
            } else {
                await couponService.create(payload)
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
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                    <h3 className="font-semibold text-ink">{coupon ? 'Editar cupón' : 'Nuevo cupón'}</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-ink transition"><X size={18} /></button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    {error && <p className="text-rose-500 text-sm">{error}</p>}

                    <div>
                        <label className={LABEL}>Código</label>
                        <input name="code" value={form.code} onChange={handle} required placeholder="VERANO20" className={FIELD + ' uppercase'} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL}>Tipo de descuento</label>
                            <select name="discountType" value={form.discountType} onChange={handle} className={FIELD}>
                                <option value="percent">Porcentaje (%)</option>
                                <option value="fixed">Fijo ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className={LABEL}>{form.discountType === 'percent' ? 'Descuento (%)' : 'Descuento ($)'}</label>
                            <input name="discountValue" type="number" min="0" value={form.discountValue} onChange={handle} required placeholder="10" className={FIELD} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={LABEL}>Monto mínimo ($)</label>
                            <input name="minOrderAmount" type="number" min="0" value={form.minOrderAmount} onChange={handle} placeholder="0" className={FIELD} />
                        </div>
                        <div>
                            <label className={LABEL}>Usos máximos</label>
                            <input name="maxUses" type="number" min="1" value={form.maxUses} onChange={handle} placeholder="Sin límite" className={FIELD} />
                        </div>
                    </div>

                    <div>
                        <label className={LABEL}>Fecha de vencimiento (opcional)</label>
                        <input name="expiresAt" type="date" value={form.expiresAt} onChange={handle} className={FIELD} />
                    </div>

                    <Toggle
                        checked={form.active}
                        onChange={v => setForm(f => ({ ...f, active: v }))}
                        label="Activo"
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-sm rounded-full border border-stone-200 text-stone-500 hover:bg-stone-50 transition">Cancelar</button>
                        <button type="submit" disabled={saving} className="px-5 py-2 text-sm rounded-full bg-sage text-white hover:bg-sage/90 disabled:opacity-50 transition">
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
