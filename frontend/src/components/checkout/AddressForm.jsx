import { SHIPPING_RATES } from '../../data/shippingRates'

const FIELD_CLS = `
  w-full px-4 py-3 rounded-xl border border-stone-200 bg-white
  text-sm text-stone-800 placeholder-stone-300
  focus:outline-none focus:border-stone-400 transition
`
const LABEL_CLS = 'block text-xs text-stone-500 mb-1'

// ─── ADDRESS FORM ─────────────────────────────────────────────────────────────

export default function AddressForm({ address, onChange, phone, onPhoneChange, onSubmit, loading, hasSavedAddress }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-8">
      <h2 className="text-sm font-medium text-stone-600 uppercase tracking-widest mb-6">
        Datos de envío
      </h2>

      {hasSavedAddress && (
        <p className="text-xs text-sage mb-5 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Usamos tu última dirección guardada. Podés modificarla si cambió.
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className={LABEL_CLS}>Teléfono de contacto</label>
          <input
            type="tel" name="phone" value={phone}
            onChange={onPhoneChange} required placeholder="+54 9 351 000-0000"
            className={FIELD_CLS}
          />
        </div>

        <div>
          <label className={LABEL_CLS}>Calle y número</label>
          <input
            type="text" name="street" value={address.street}
            onChange={onChange} required placeholder="Av. Corrientes 1234"
            className={FIELD_CLS}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Ciudad</label>
            <input
              type="text" name="city" value={address.city}
              onChange={onChange} required placeholder="Córdoba"
              className={FIELD_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>Provincia</label>
            <select
              name="state" value={address.state}
              onChange={onChange} required
              className={FIELD_CLS}
            >
              <option value="" disabled>Seleccioná tu provincia...</option>
              {SHIPPING_RATES.map(r => (
                <option key={r.province} value={r.province}>{r.province}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLS}>Código postal</label>
            <input
              type="text" name="zipCode" value={address.zipCode}
              onChange={onChange} required placeholder="5000"
              className={FIELD_CLS}
            />
          </div>
          <div>
            <label className={LABEL_CLS}>País</label>
            <input
              type="text" name="country" value={address.country}
              readOnly className={`${FIELD_CLS} bg-stone-50 text-stone-400 cursor-default`}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-sage text-white py-3 rounded-full font-medium hover:bg-sage/90 transition"
        >
          Continuar al pago →
        </button>
      </form>
    </div>
  )
}
