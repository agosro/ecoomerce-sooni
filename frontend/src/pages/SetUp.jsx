import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/api"
import useAuthStore from "../store/auth.store"
import { useCart } from "../context/CartContext"
import AuthToggle from "../components/setUp/AuthToggle"
import AuthForm from "../components/setUp/AuthForm"
import DemoCredentials from "../components/setUp/DemoCredentials"

export default function SetUp() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { fetchCart } = useCart()

  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const fillCredentials = (email, password) => {
    setFormData((prev) => ({ ...prev, email, password }))
    setIsLogin(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        const response = await authService.login({
          email: formData.email,
          password: formData.password,
        })
        login(response.data.user, response.data.token)
        await fetchCart()
        navigate(response.data.user.role === "admin" ? "/admin" : "/")
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Las contraseñas no coinciden")
          setLoading(false)
          return
        }
        const response = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
        login(response.data.user, response.data.token)
        await fetchCart()
        navigate("/")
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error en la autenticación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-ivory py-40 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-serifkr text-ink">Bienvenida</h1>
          <p className="text-ink/60 mt-2 text-sm">Tu rutina de skincare te espera</p>
        </div>

        <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />

        <AuthForm
          isLogin={isLogin}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        {isLogin && <DemoCredentials onFill={fillCredentials} />}
      </div>
    </section>
  )
}
