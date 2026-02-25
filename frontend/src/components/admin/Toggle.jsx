// ─── TOGGLE SWITCH ────────────────────────────────────────────────────────────

export default function Toggle({ checked, onChange, label, colorOn = 'bg-sage', disabled = false }) {
    return (
        <label className={`flex items-center gap-2.5 select-none ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? colorOn : 'bg-stone-200'} ${disabled ? 'pointer-events-none' : ''}`}
            >
                <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
            {label && <span className="text-sm text-stone-600">{label}</span>}
        </label>
    )
}
