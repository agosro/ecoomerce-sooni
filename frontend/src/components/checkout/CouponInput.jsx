import { Tag, X } from 'lucide-react'

// ─── COUPON INPUT ─────────────────────────────────────────────────────────────

export default function CouponInput({ coupon, code, onChange, onApply, onRemove, loading, error }) {
  if (coupon) {
    return (
      <div className="mb-4 flex items-center justify-between bg-sage/10 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2 text-sage text-sm">
          <Tag size={14} />
          <span className="font-medium">{coupon.code}</span>
          <span className="text-xs">-${coupon.discount.toLocaleString('es-AR')}</span>
        </div>
        <button onClick={onRemove} className="text-stone-400 hover:text-stone-600 transition">
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <p className="text-xs text-stone-400 mb-2">¿Tenés un cupón?</p>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={e => onChange(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onApply())}
          placeholder="CÓDIGO"
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 uppercase transition"
        />
        <button
          type="button"
          onClick={onApply}
          disabled={loading}
          className="px-3 py-2 text-sm bg-sage text-white rounded-lg hover:bg-sage/90 disabled:opacity-50 transition"
        >
          {loading ? '...' : 'Aplicar'}
        </button>
      </div>
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  )
}
