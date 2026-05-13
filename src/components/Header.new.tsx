import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { label: 'Início', path: '/' },
  { label: 'Serviços', path: '/servicos' },
  { label: 'Agendamento', path: '/agendamento' },
  { label: 'Contato', path: '/contato' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="w-full sticky top-0 z-50 bg-bordo/95 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex flex-col gap-0.5">
          <span className="text-2xl md:text-3xl font-semibold tracking-[0.32em] text-dourado" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            TAISA
          </span>
          <span className="text-xs uppercase tracking-[0.42em] text-rosa-claro" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Ateliê de Beleza
          </span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `text-sm uppercase tracking-[0.24em] font-medium transition duration-300 ${
                  isActive ? 'text-dourado' : 'text-rosa-claro hover:text-dourado'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <NavLink
          to="/contato"
          className="hidden md:inline-flex items-center justify-center rounded-full bg-dourado text-bordo px-5 py-3 text-sm uppercase tracking-[0.22em] font-semibold transition duration-300 hover:bg-dourado-claro"
        >
          Contato
        </NavLink>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full text-rosa-claro hover:text-dourado transition duration-300"
          aria-label="Abrir menu mobile"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-rosa-claro/20 bg-bordo/95 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 uppercase tracking-[0.18em] font-medium transition duration-300 ${
                  isActive ? 'bg-dourado text-bordo' : 'text-rosa-claro hover:bg-rosa-claro/10 hover:text-dourado'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
