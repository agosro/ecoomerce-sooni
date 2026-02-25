// ─── REUSABLE FILTER COMPONENTS ───────────────────────────────────────────────

/**
 * FilterSearch — input de texto para buscar
 * Props: value, onChange, placeholder
 */
export function FilterSearch({ value, onChange, placeholder = 'Buscar...' }) {
    return (
        <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:border-stone-400 transition w-full sm:w-56"
        />
    )
}

/**
 * FilterSort — select de ordenamiento
 * Props: value, onChange, options: [{ value, label }]
 */
export function FilterSort({ value, onChange, options }) {
    return (
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 focus:outline-none focus:border-stone-400 transition bg-white cursor-pointer"
        >
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    )
}

/**
 * FilterPills — grupo de botones tipo pill para filtros
 * Props: value, onChange, options: [{ value, label, activeClass? }]
 *   activeClass defaults to 'bg-ink text-white'
 */
export function FilterPills({ value, onChange, options }) {
    return (
        <div className="flex flex-wrap gap-2">
            {options.map(o => (
                <button
                    key={o.value}
                    onClick={() => onChange(o.value)}
                    className={`px-3 py-1.5 rounded-full text-xs transition ${
                        value === o.value
                            ? (o.activeClass ?? 'bg-ink text-white')
                            : 'bg-sand/40 text-stone-500 hover:bg-sand/70'
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    )
}
