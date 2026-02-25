import { Eye, EyeOff } from "lucide-react"

export default function InputField({
  icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  showPassword,
  onTogglePassword,
  required,
}) {
  const isPasswordField = type === "password"
  const inputType = isPasswordField && showPassword ? "text" : type

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/50">
        {icon}
      </span>
      <input
        type={inputType}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-11 pr-11 py-3 bg-white/70 border border-ink/20 rounded-xl text-sm focus:outline-none focus:border-sage transition"
      />
      {isPasswordField && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink transition"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  )
}
