import AnimatedLink from "../ui/AnimatedLink"

const links = [
  { to: "/", label: "Inicio", end: true, underlineActive: false },
  { to: "/productos", label: "Productos" },
  { to: "/rutina", label: "Rutina" },
  { to: "/nosotros", label: "Sobre nosotros" },
  { to: "/contacto", label: "Contacto" },
]

export default function NavLinks({ onClick }) {
  return (
    <nav className="flex flex-col md:flex-row gap-6 md:gap-10 font-serifkr text-sm">
      {links.map(link => (
        <AnimatedLink
          key={link.to}
          to={link.to}
          end={link.end}
          underlineActive={link.underlineActive}
          onClick={onClick}
        >
          {link.label}
        </AnimatedLink>
      ))}
    </nav>
  )
}

