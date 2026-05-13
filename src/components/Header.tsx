import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'

const TaisaLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" fill="none" viewBox="0 0 48 46">
    <path
      fill="white"
      d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
    />
  </svg>
)

const navItems = [
  { label: 'Início',       path: '/' },
  { label: 'Serviços',     path: '/servicos' },
  { label: 'Agendamento',  path: '/agendamento' },
  { label: 'Contato',      path: '/contato' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="w-full sticky top-0 z-50"
      style={{
        background: 'rgba(13,6,32,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(134,59,255,0.18)',
        boxShadow: '0 4px 32px rgba(13,6,32,0.4)',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">

        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #863bff, #7e14ff)',
              boxShadow: '0 4px 16px rgba(134,59,255,0.45)',
            }}
          >
            <TaisaLogo />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-white font-bold text-lg tracking-widest"
              style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.25em' }}
            >
              TAISA
            </span>
            <span className="text-xs tracking-widest" style={{ color: 'rgba(237,230,255,0.45)', letterSpacing: '0.3em', fontSize: '9px' }}>
              ATELIÊ DE BELEZA
            </span>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'white' : 'rgba(237,230,255,0.55)',
                background: isActive ? 'rgba(134,59,255,0.22)' : 'transparent',
                letterSpacing: '0.18em',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/agendamento"
            className="hidden md:inline-flex btn-primary text-xs px-5 py-2.5 shine"
          >
            Agendar
          </Link>

          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ color: 'rgba(237,230,255,0.7)', background: 'rgba(134,59,255,0.12)' }}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-5 pb-4 space-y-1 animate-fade-in"
          style={{ borderTop: '1px solid rgba(134,59,255,0.12)' }}
        >
          {navItems.map(item => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200 ${
                  isActive ? 'text-white' : ''
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'white' : 'rgba(237,230,255,0.6)',
                background: isActive ? 'rgba(134,59,255,0.2)' : 'transparent',
                letterSpacing: '0.16em',
              })}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <Link
              to="/agendamento"
              onClick={() => setMenuOpen(false)}
              className="btn-primary w-full text-xs"
            >
              Agendar agora
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
