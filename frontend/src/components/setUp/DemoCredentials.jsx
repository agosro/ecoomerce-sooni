const DEMO_ACCOUNTS = [
  { label: "Viewer", email: "admin.viewer@sooni.com", password: "AdminViewer123!" },
  { label: "Demo",   email: "demo@sooni.com",         password: "DemoPassword123!" },
]

export default function DemoCredentials({ onFill }) {
  return (
    <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <p className="text-[11px] uppercase tracking-widest text-stone-400 mb-3">
        Cuentas de prueba
      </p>
      <div className="space-y-2">
        {DEMO_ACCOUNTS.map(({ label, email, password }) => (
          <button
            key={label}
            type="button"
            onClick={() => onFill(email, password)}
            className="w-full flex items-center justify-between gap-2 rounded-xl bg-white border border-stone-200 px-3 py-2 text-left hover:border-sage/50 hover:bg-sage/5 transition group"
          >
            <span className="text-xs font-medium text-ink/70 w-12">{label}</span>
            <span className="text-xs text-stone-400 flex-1 truncate">{email}</span>
            <span className="text-[10px] text-stone-300 group-hover:text-sage transition">
              usar →
            </span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-stone-400 mt-3">Click en una fila para autocompletar.</p>
    </div>
  )
}
