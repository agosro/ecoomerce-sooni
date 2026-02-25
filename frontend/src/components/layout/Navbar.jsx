import { useState } from "react"
import { Menu, X } from "lucide-react"

import Logo from "../ui/Logo"
import NavLinks from "./NavLinks"
import NavActions from "./NavActions"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-gray-200 bg-ivory relative z-50">
      <div className="max-w-7xl mx-auto h-20 px-8 flex items-center">
        {/* LEFT: logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* CENTER: nav links (centradas) */}
        <div className="flex-1 flex justify-center">
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
          </div>
        </div>

        {/* RIGHT: acciones (perfil / carrito) + mobile menu button */}
        <div className="flex items-center gap-6">
          {/* Desktop actions */}
          <div className="hidden md:flex items-center">
            <NavActions />
          </div>

          {/* Mobile actions + menu button */}
          <div className="flex items-center md:hidden gap-6">
            <NavActions />
            <button
              onClick={() => setOpen(!open)}
              className="text-ink"
              aria-label="Abrir menú"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu: solo links */}
      {open && (
        <div className="md:hidden bg-ivory border-t border-ink/10">
          <div className="px-8 py-6">
            <NavLinks onClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  )
}