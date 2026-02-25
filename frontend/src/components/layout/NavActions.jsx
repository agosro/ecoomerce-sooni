import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, UserPlus, LogIn, ShoppingBag, CircleUserRound, ShoppingCart, LayoutDashboard } from 'lucide-react'
import useAuthStore from '../../store/auth.store'
import { useCart } from '../../context/CartContext'

export default function NavActions() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, isAdmin, isAdminOrViewer } = useAuthStore()
  const { cart } = useCart()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const go = (path) => {
    setDropdownOpen(false)
    navigate(path)
  }

  return (
    <div className="flex items-center gap-6 text-ink">
      {/* User button + dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-label="Cuenta"
          className="hover:opacity-70 transition"
        >
          <User size={20} strokeWidth={1.5} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-10 w-52 bg-white rounded-2xl shadow-lg border border-stone-100 py-2 z-50">
            {!isAuthenticated ? (
              <>
                <DropdownItem icon={<LogIn size={16} strokeWidth={1.5} />} label="Iniciar sesión" onClick={() => go('/setup')} />
                <DropdownItem icon={<UserPlus size={16} strokeWidth={1.5} />} label="Crear cuenta" onClick={() => go('/setup')} />
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-xs text-stone-400 truncate">{user?.email}</div>
                <div className="my-1 border-t border-stone-100" />
                <DropdownItem icon={<CircleUserRound size={16} strokeWidth={1.5} />} label="Mi perfil" onClick={() => go('/perfil')} />
                <DropdownItem icon={<ShoppingBag size={16} strokeWidth={1.5} />} label="Mis compras" onClick={() => go('/orders')} />
                {isAdminOrViewer && (
                  <>
                    <div className="my-1 border-t border-stone-100" />
                    <DropdownItem icon={<LayoutDashboard size={16} strokeWidth={1.5} />} label="Panel admin" onClick={() => go('/admin')} />
                  </>
                )}
                <div className="my-1 border-t border-stone-100" />
                <DropdownItem
                  icon={<LogIn size={16} strokeWidth={1.5} className="rotate-180" />}
                  label="Cerrar sesión"
                  onClick={handleLogout}
                  danger
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Cart button */}
      <div className="relative">
        <button
          onClick={() => navigate('/carrito')}
          aria-label="Carrito"
          className="hover:opacity-70 transition"
        >
          <ShoppingCart size={20} strokeWidth={1.5} />
        </button>

        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-rose-400 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {itemCount}
          </span>
        )}
      </div>
    </div>
  )
}

function DropdownItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-stone-50 ${danger ? 'text-rose-500' : 'text-stone-700'
        }`}
    >
      <span className="text-stone-400">{icon}</span>
      {label}
    </button>
  )
}
