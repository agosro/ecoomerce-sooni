import { Link } from "react-router-dom"
import { Instagram, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-ivory border-t border-gray-200 pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-20">
          {/* Brand */}
          <div>
            <h3 className="font-serifkr text-lg text-ink mb-4">
              SOONI<span className="text-sm font-normal ml-1">skincare</span>
            </h3>
            <p className="text-sm text-ink/60 leading-relaxed max-w-xs">
              Cuidado coreano para una piel radiante.
              <br />
              Simple, efectivo, natural.
            </p>
          </div>

          {/* Navegar */}
          <div>
            <h4 className="text-sm font-medium text-ink mb-4">Navegar</h4>
            <ul className="space-y-3 text-sm text-ink/60">
              <li><Link to="/productos" className="hover:text-ink transition">Productos</Link></li>
              <li><Link to="/rutina" className="hover:text-ink transition">Rutina</Link></li>
              <li><Link to="/sobre-nosotros" className="hover:text-ink transition">Sobre nosotros</Link></li>
              <li><Link to="/contacto" className="hover:text-ink transition">Contacto</Link></li>
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h4 className="text-sm font-medium text-ink mb-4">Ayuda</h4>
            <ul className="space-y-3 text-sm text-ink/60">
              <li><Link to="/envios" className="hover:text-ink transition">Envíos</Link></li>
              <li><Link to="/devoluciones" className="hover:text-ink transition">Devoluciones</Link></li>
              <li><Link to="/faq" className="hover:text-ink transition">FAQ</Link></li>
              <li><Link to="/terminos" className="hover:text-ink transition">Términos</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-medium text-ink mb-4">Newsletter</h4>
            <p className="text-sm text-ink/60 mb-4 max-w-xs">
              Recibe tips de skincare y ofertas exclusivas.
            </p>

            <form className="flex items-center gap-3">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 rounded-full border border-ink/20 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ink/30 bg-transparent"
              />
              <button
                type="submit"
                className="rounded-full bg-ink px-5 py-2 text-sm text-white hover:bg-ink/90 transition"
              >
                Unirse
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-ink/10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-ink/50">
            © 2025 SOONI Skincare. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-4 text-ink/60">
            <a href="#" aria-label="Instagram" className="hover:text-ink transition">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Email" className="hover:text-ink transition">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
