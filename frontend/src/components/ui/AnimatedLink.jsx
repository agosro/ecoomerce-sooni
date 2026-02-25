import { NavLink } from "react-router-dom"

export default function AnimatedLink({
  to,
  children,
  className = "",
  underlineActive = true,
  end = false,
  onClick,
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `
        relative
        transition-colors duration-300

        ${isActive ? "text-ink" : "text-stone-700 hover:text-ink"}

        after:content-['']
        after:absolute
        after:left-0
        after:-bottom-1
        after:w-full
        after:h-[1px]
        after:bg-ink
        after:scale-x-0
        after:origin-left
        after:transition-transform
        after:duration-300
        hover:after:scale-x-100

        ${isActive && underlineActive ? "after:scale-x-100" : ""}
        ${className}
        `
      }
    >
      {children}
    </NavLink>
  )
}
