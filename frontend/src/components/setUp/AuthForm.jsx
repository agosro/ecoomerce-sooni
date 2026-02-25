import { useState } from "react"
import { Mail, Lock, User } from "lucide-react"
import InputField from "./InputField"

export default function AuthForm({ isLogin, onSubmit, loading, error, formData, onChange }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-500 text-center">{error}</div>
      )}

      {!isLogin && (
        <InputField
          icon={<User size={16} />}
          name="name"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={onChange}
          required
        />
      )}

      <InputField
        icon={<Mail size={16} />}
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={onChange}
        required
      />

      <InputField
        icon={<Lock size={16} />}
        name="password"
        type="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={onChange}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((p) => !p)}
        required
      />

      {!isLogin && (
        <InputField
          icon={<Lock size={16} />}
          name="confirmPassword"
          type="password"
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={onChange}
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword((p) => !p)}
          required
        />
      )}

      {isLogin && (
        <div className="text-right text-sm text-ink/60">
          ¿Olvidaste tu contraseña?
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-sage hover:bg-sage/90 text-white py-3 rounded-full font-medium transition mt-2"
      >
        {loading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Crear cuenta"}
      </button>

      {!isLogin && (
        <p className="text-xs text-ink/60 text-center pt-2">
          Al crear tu cuenta, aceptás nuestros{" "}
          <span className="underline">términos</span> y{" "}
          <span className="underline">política de privacidad</span>.
        </p>
      )}
    </form>
  )
}
