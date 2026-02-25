export default function AuthToggle({ isLogin, onToggle }) {
  return (
    <div className="bg-stone-200 rounded-full p-1 flex mb-6">
      <button
        onClick={() => onToggle(true)}
        className={`flex-1 py-2 rounded-full text-sm transition ${
          isLogin ? "bg-white shadow text-ink" : "text-ink/60"
        }`}
      >
        Iniciar sesión
      </button>
      <button
        onClick={() => onToggle(false)}
        className={`flex-1 py-2 rounded-full text-sm transition ${
          !isLogin ? "bg-white shadow text-ink" : "text-ink/60"
        }`}
      >
        Crear cuenta
      </button>
    </div>
  )
}
