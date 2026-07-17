import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Sparkles, Star, MessageCircle } from 'lucide-react'
import type { Servico, Depoimento } from '../types'
import { ServiceIcon } from '../utils/serviceIcons'
import Reveal from '../components/Reveal'
import salonPhoto from '../assets/photo-1560066984-138dadb4c035.jpg'

const SERVICOS: Servico[] = [
  { id: '1', nome: 'Corte & Escova',        descricao: 'Corte personalizado com lavatório, hidratação e finalização premium.',   preco: 120, duracao: 60,  categoria: 'cabelo',   icone: '✂️' },
  { id: '2', nome: 'Coloração Completa',    descricao: 'Tintura com proteção dos fios, hidratação profunda e acabamento perfeito.', preco: 280, duracao: 150, categoria: 'cabelo', icone: '🎨' },
  { id: '3', nome: 'Manicure & Pedicure',   descricao: 'Cuidado completo para mãos e pés com esmalte e produtos premium.',       preco: 90,  duracao: 90,  categoria: 'unhas',   icone: '💅' },
  { id: '4', nome: 'Escova Progressiva',    descricao: 'Alisamento duradouro com proteção térmica e tratamento anti-frizz.',     preco: 350, duracao: 180, categoria: 'cabelo',  icone: '💎' },
  { id: '5', nome: 'Design de Sobrancelha', descricao: 'Modelagem personalizada com henna ou micropigmentação artesanal.',       preco: 75,  duracao: 45,  categoria: 'estetica', icone: '✨' },
  { id: '6', nome: 'Ritual de Beleza',      descricao: 'Pacote completo: manicure, pedicure, sobrancelha e máscara facial.',     preco: 220, duracao: 180, categoria: 'pacote',  icone: '🌸' },
]

const DEPOIMENTOS: Depoimento[] = [
  { id: '1', nome: 'Mariana Costa',  texto: 'Atendimento impecável! Saí do salão me sentindo uma rainha. A Taisa tem um talento incrível para entender o que cada cliente precisa.',  avaliacao: 5, servico: 'Coloração Completa' },
  { id: '2', nome: 'Fernanda Lima',  texto: 'Melhor escova progressiva que já fiz. O resultado durou muito mais do que eu esperava e os fios ficaram incrivelmente hidratados.',       avaliacao: 5, servico: 'Escova Progressiva' },
  { id: '3', nome: 'Juliana Mendes', texto: 'O ritual de beleza é simplesmente divino. Uma tarde de puro cuidado e relaxamento. Com certeza voltarei muitas vezes!',                 avaliacao: 5, servico: 'Ritual de Beleza' },
]

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--gold)' }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function TestimonialCarousel({ items }: { items: Depoimento[] }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive(i => (i + 1) % items.length), 6000)
    return () => clearInterval(timer)
  }, [items.length])

  const go = (index: number) => setActive((index + items.length) % items.length)

  return (
    <div className="testimonial-carousel">
      <div className="testimonial-carousel-track">
        {items.map((d, i) => (
          <div key={d.id} className={`testimonial-card testimonial-carousel-slide${i === active ? ' active' : ''}`}>
            <div className="testimonial-stars">
              {Array.from({ length: d.avaliacao }).map((_, s) => <StarIcon key={s} />)}
            </div>
            <p className="testimonial-text">"{d.texto}"</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{d.nome[0]}</div>
              <div>
                <strong className="testimonial-name">{d.nome}</strong>
                <small className="testimonial-service">{d.servico}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonial-carousel-controls">
        <button className="testimonial-carousel-arrow" onClick={() => go(active - 1)} aria-label="Depoimento anterior">
          <ChevronLeft size={18} />
        </button>
        <div className="testimonial-carousel-dots">
          {items.map((d, i) => (
            <button
              key={d.id}
              className={`testimonial-carousel-dot${i === active ? ' active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Ver depoimento de ${d.nome}`}
            />
          ))}
        </div>
        <button className="testimonial-carousel-arrow" onClick={() => go(active + 1)} aria-label="Próximo depoimento">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-dots" />
        <div className="container hero-content">
          <div className="hero-text anim-fade-up">
            <span className="section-badge">Bem-vinda ao Ateliê</span>
            <h1 className="hero-title">
              Arte & beleza que<br />
              <span className="gradient-text">transformam</span> sua essência
            </h1>
            <p className="hero-subtitle">
              Cada visita é uma experiência única de cuidado, sofisticação e bem-estar.
              Descubra o que há de mais especial em você.
            </p>
            <div className="hero-actions">
              <Link to="/agendamento" className="btn btn-primary btn-lg">Agendar agora</Link>
              <Link to="/servicos" className="btn btn-outline btn-lg">Ver serviços</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>500+</strong>
                <span>Clientes satisfeitas</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>5 anos</strong>
                <span>De experiência</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <strong>4.9★</strong>
                <span>Avaliação média</span>
              </div>
            </div>
          </div>

          <div className="hero-visual anim-fade-up anim-delay-2">
            <div className="hero-image-wrap">
              <div className="hero-image-placeholder">
                <img
                  src="/logo.jpeg"
                  alt="Taisa Ateliê"
                  className="hero-logo-float"
                />
              </div>
              <div className="hero-card-float hero-card-float-1">
                <Sparkles size={22} color="var(--wine)" />
                <div>
                  <strong>Manicure</strong>
                  <small>Disponível hoje</small>
                </div>
              </div>
              <div className="hero-card-float hero-card-float-2">
                <Star size={22} color="var(--gold)" fill="var(--gold)" />
                <div>
                  <strong>4.9 / 5.0</strong>
                  <small>500+ avaliações</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVIÇOS DESTAQUE */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="section-header anim-fade-up">
            <span className="section-badge">O que oferecemos</span>
            <h2 className="section-title">Serviços <span className="gradient-text">premium</span></h2>
            <p className="section-subtitle">
              Tratamentos desenvolvidos com as melhores técnicas e produtos do mercado para realçar sua beleza natural.
            </p>
            <div className="section-divider" />
          </div>

          <div className="grid-3">
            {SERVICOS.map((s, i) => (
              <Reveal key={s.id} delay={i * 80} className="service-card">
                <div className="service-card-icon"><ServiceIcon nome={s.nome} categoria={s.categoria} /></div>
                <h3 className="service-card-title">{s.nome}</h3>
                <p className="service-card-desc">{s.descricao}</p>
                <div className="service-card-footer">
                  <div>
                    <small className="service-card-from">A partir de</small>
                    <strong className="service-card-price">R$ {s.preco.toFixed(2)}</strong>
                  </div>
                  <span className="service-card-duration">{s.duracao} min</span>
                </div>
                <Link to="/agendamento" className="btn btn-outline btn-full" style={{ marginTop: '1.25rem' }}>
                  Agendar
                </Link>
              </Reveal>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/servicos" className="btn btn-primary btn-lg">Ver todos os serviços</Link>
          </div>
        </div>
      </section>

      {/* SOBRE / DIFERENCIAIS */}
      <section className="section about-section">
        <div className="container about-grid">
          <Reveal className="about-image-wrap">
            <img src={salonPhoto} alt="Interior do Taisa Ateliê de Beleza" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Reveal>
          <Reveal delay={120} className="about-text">
            <span className="section-badge">Nossa história</span>
            <h2 className="section-title" style={{ fontSize: '2.25rem' }}>
              Beleza que nasce do <span className="gradient-text">cuidado genuíno</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Há mais de 5 anos, o Taisa Ateliê é sinônimo de excelência em beleza feminina em São Paulo.
              Nossa missão é fazer cada cliente se sentir única, especial e completamente cuidada.
            </p>
            <ul className="about-list">
              {[
                'Profissionais certificadas e em constante atualização',
                'Produtos premium e veganos de origem sustentável',
                'Ambiente aconchegante e personalizado',
                'Atendimento por hora marcada para sua comodidade',
              ].map(item => (
                <li key={item} className="about-list-item">
                  <span className="about-list-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/contato" className="btn btn-primary" style={{ marginTop: '2rem' }}>
              Fale conosco
            </Link>
          </Reveal>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="section" style={{ background: 'var(--rose-light)' }}>
        <div className="container">
          <Reveal as="div" className="section-header">
            <span className="section-badge">Depoimentos</span>
            <h2 className="section-title">O que nossas clientes <span className="gradient-text">dizem</span></h2>
            <div className="section-divider" />
          </Reveal>
          <Reveal delay={100}>
            <TestimonialCarousel items={DEPOIMENTOS} />
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="hero-dark">
        <div className="hero-dark-glow" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="section-badge" style={{ borderColor: 'rgba(201,168,76,0.4)', color: 'var(--gold-light)' }}>
            Pronta para se transformar?
          </span>
          <h2 className="section-title" style={{ color: '#fff', fontSize: '2.5rem', marginTop: '1rem' }}>
            Agende sua visita <span style={{ color: 'var(--gold-light)' }}>hoje mesmo</span>
          </h2>
          <p style={{ color: 'rgba(253,248,243,0.7)', maxWidth: '500px', margin: '1rem auto 2.5rem', lineHeight: 1.8 }}>
            Nossa equipe está pronta para criar a experiência perfeita para você.
            Marque seu horário em poucos cliques.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/agendamento" className="btn btn-gold btn-lg">Agendar agora</Link>
            <Link to="/contato" className="btn btn-outline-white btn-lg">
              <MessageCircle size={18} /> Falar no WhatsApp
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
