import { Link } from 'react-router-dom'
import { SITE, whatsappUrl } from '../../config/site'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand">
              <span className="footer-brand-icon">T</span>
              <span className="footer-brand-text">Taisa <em>Ateliê</em></span>
            </div>
            <p className="footer-tagline">
              Arte, beleza e cuidado personalizado para cada mulher.
            </p>
            <div className="footer-socials">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="footer-social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              <a href={whatsappUrl('Olá! Vim pelo site do Taisa Ateliê.')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="footer-social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="footer-social">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="footer-heading">Navegação</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Início</Link></li>
              <li><Link to="/servicos" className="footer-link">Serviços</Link></li>
              <li><Link to="/galeria" className="footer-link">Galeria</Link></li>
              <li><Link to="/agendamento" className="footer-link">Agendamento</Link></li>
              <li><Link to="/contato" className="footer-link">Contato</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-heading">Serviços</h4>
            <ul className="footer-links">
              <li><span className="footer-link">Corte & Escova</span></li>
              <li><span className="footer-link">Coloração</span></li>
              <li><span className="footer-link">Tratamentos Capilares</span></li>
              <li><span className="footer-link">Manicure & Pedicure</span></li>
              <li><span className="footer-link">Design de Sobrancelha</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="footer-heading">Contato</h4>
            <ul className="footer-links">
              <li>
                <a href={`tel:+${SITE.whatsappNumero}`} className="footer-link footer-contact-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  {SITE.telefoneExibicao}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="footer-link footer-contact-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  {SITE.email}
                </a>
              </li>
              <li>
                <span className="footer-link footer-contact-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {SITE.cidade}
                </span>
              </li>
              <li style={{ marginTop: '0.75rem' }}>
                <span className="footer-hours">Seg–Sex: 09h–19h</span><br />
                <span className="footer-hours">Sábado: 10h–17h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} Taisa Ateliê de Beleza. Todos os direitos reservados.</p>
          <Link to="/login" className="footer-link" style={{ fontSize: '0.75rem', opacity: 0.5 }}>Área administrativa</Link>
        </div>
      </div>
    </footer>
  )
}
