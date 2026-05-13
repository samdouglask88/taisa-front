import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/galeria', label: 'Galeria' },
  { to: '/contato', label: 'Contato' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem' }}>
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
          <span className="nav-logo-icon">T</span>
          <span className="nav-logo-text">Taisa <em>Ateliê</em></span>
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links-desktop">
          {NAV_LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="nav-cta">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-outline btn-sm">Dashboard</Link>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <Link to="/agendamento" className="btn btn-primary btn-sm">Agendar agora</Link>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {NAV_LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
        <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(123,45,62,0.1)', marginTop: '0.5rem' }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-outline btn-full" style={{ marginBottom: '0.5rem' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button className="btn btn-ghost btn-full" onClick={() => { handleLogout(); setMenuOpen(false) }}>Sair</button>
            </>
          ) : (
            <Link to="/agendamento" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>Agendar agora</Link>
          )}
        </div>
      </div>
    </header>
  )
}
