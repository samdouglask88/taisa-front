import { Link } from 'react-router-dom'

const TaisaLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" fill="none" viewBox="0 0 48 46">
    <path
      fill="white"
      d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
    />
  </svg>
)

export default function Footer() {
  const year = new Date().getFullYear()
  const navItems = [
    { label: 'Início',       path: '/' },
    { label: 'Serviços',     path: '/servicos' },
    { label: 'Agendamento',  path: '/agendamento' },
    { label: 'Contato',      path: '/contato' },
  ]

  return (
    <footer
      className="mt-20"
      style={{
        background: 'linear-gradient(180deg, #0d0620 0%, #1a0a2e 100%)',
        borderTop: '1px solid rgba(134,59,255,0.2)',
      }}
    >
      {/* Top glow line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #863bff, #47bfff, transparent)' }} />

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #863bff, #7e14ff)', boxShadow: '0 4px 16px rgba(134,59,255,0.4)' }}
              >
                <TaisaLogo />
              </div>
              <span
                className="text-white font-bold text-base"
                style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.25em' }}
              >
                TAISA
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(237,230,255,0.5)' }}>
              Experiência sofisticada de beleza com atenção total ao seu conforto e resultado.
            </p>
            <p
              className="text-sm italic"
              style={{ color: '#863bff', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.1em' }}
            >
              A Alma da sua Beleza
            </p>
          </div>

          {/* Nav */}
          <div>
            <h3
              className="text-xs font-bold uppercase mb-5"
              style={{ color: 'rgba(237,230,255,0.3)', letterSpacing: '0.25em' }}
            >
              Navegação
            </h3>
            <nav className="space-y-3">
              {navItems.map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-sm transition-all duration-200 hover:translate-x-1"
                  style={{ color: 'rgba(237,230,255,0.55)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#863bff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(237,230,255,0.55)')}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-xs font-bold uppercase mb-5"
              style={{ color: 'rgba(237,230,255,0.3)', letterSpacing: '0.25em' }}
            >
              Contato
            </h3>
            <div className="space-y-3 text-sm" style={{ color: 'rgba(237,230,255,0.55)' }}>
              {[
                { icon: '📞', text: '(11) 98765-4321' },
                { icon: '✉️', text: 'contato@taisa.com.br' },
                { icon: '📍', text: 'São Paulo, SP' },
              ].map(({ icon, text }) => (
                <p key={text} className="flex items-center gap-2">
                  <span>{icon}</span> {text}
                </p>
              ))}
            </div>
          </div>

          {/* Schedule + Social */}
          <div>
            <h3
              className="text-xs font-bold uppercase mb-5"
              style={{ color: 'rgba(237,230,255,0.3)', letterSpacing: '0.25em' }}
            >
              Horários
            </h3>
            <div className="space-y-2 text-sm mb-6" style={{ color: 'rgba(237,230,255,0.55)' }}>
              <p>Seg – Sex: 09h às 19h</p>
              <p>Sábado: 10h às 17h</p>
              <p style={{ color: 'rgba(237,230,255,0.3)' }}>Domingo: fechado</p>
            </div>
            {/* Social icons */}
            <div className="flex gap-3">
              {['📷', '💬', 'f'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200"
                  style={{ background: 'rgba(134,59,255,0.12)', color: 'rgba(237,230,255,0.6)', border: '1px solid rgba(134,59,255,0.15)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(134,59,255,0.25)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'white';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(134,59,255,0.4)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(134,59,255,0.12)';
                    (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(237,230,255,0.6)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(134,59,255,0.15)';
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs"
          style={{ borderTop: '1px solid rgba(134,59,255,0.12)', color: 'rgba(237,230,255,0.3)' }}
        >
          <p>© {year} Taisa Ateliê de Beleza. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#863bff' }} />
            <span style={{ color: '#863bff' }}>taisa.com.br</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
