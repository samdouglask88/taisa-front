import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Servico } from '../types'
import type { ApiService } from '../types/api'
import { apiFetch } from '../services/api'
import { ServiceIcon } from '../utils/serviceIcons'
import Reveal from '../components/Reveal'

const FALLBACK: Servico[] = [
  { id: '1', nome: 'Corte Feminino',        descricao: 'Corte personalizado com lavatório, hidratação e finalização premium.', preco: 120, duracao: 60,  categoria: 'Cabelo',   icone: '✂️' },
  { id: '2', nome: 'Coloração Completa',    descricao: 'Tintura com proteção dos fios e acabamento perfeito.',                 preco: 280, duracao: 150, categoria: 'Cabelo',   icone: '🎨' },
  { id: '3', nome: 'Manicure & Pedicure',   descricao: 'Cuidado completo para mãos e pés com esmalte importado.',             preco: 90,  duracao: 90,  categoria: 'Unhas',    icone: '💅' },
  { id: '4', nome: 'Escova Progressiva',    descricao: 'Alisamento duradouro com proteção térmica anti-frizz.',               preco: 350, duracao: 180, categoria: 'Cabelo',   icone: '💎' },
  { id: '5', nome: 'Design de Sobrancelha', descricao: 'Modelagem personalizada com henna ou micropigmentação.',              preco: 75,  duracao: 45,  categoria: 'Estética', icone: '✨' },
  { id: '6', nome: 'Ritual de Beleza',      descricao: 'Pacote completo: manicure, pedicure e máscara facial.',               preco: 220, duracao: 180, categoria: 'Pacote',   icone: '🌸' },
  { id: '7', nome: 'Hidratação Profunda',   descricao: 'Tratamento intensivo com ampolas de nutrição e reconstrução.',        preco: 160, duracao: 90,  categoria: 'Cabelo',   icone: '💧' },
  { id: '8', nome: 'Maquiagem Social',      descricao: 'Maquiagem profissional para eventos e ocasiões especiais.',           preco: 200, duracao: 120, categoria: 'Estética', icone: '💄' },
  { id: '9', nome: 'Spa dos Pés',           descricao: 'Esfoliação, hidratação e massagem relaxante para pés perfeitos.',     preco: 70,  duracao: 60,  categoria: 'Unhas',    icone: '🌿' },
]

const CATEGORIAS = ['Todos', 'Cabelo', 'Unhas', 'Estética', 'Pacote']

function mapServico(s: ApiService): Servico {
  return {
    id: s._id,
    nome: s.name,
    descricao: s.description ?? '',
    preco: s.price,
    duracao: s.durationMinutes ?? 0,
    categoria: s.category,
    icone: '',
  }
}

export default function Servicos() {
  const [catAtiva, setCatAtiva] = useState('Todos')
  const [servicos, setServicos] = useState<Servico[]>(FALLBACK)

  useEffect(() => {
    apiFetch<ApiService[]>('/services')
      .then((data) => {
        if (data && data.length > 0) setServicos(data.map(mapServico))
      })
      .catch(() => { /* mantém o catálogo FALLBACK exibido */ })
  }, [])

  const filtrados = catAtiva === 'Todos'
    ? servicos
    : servicos.filter(s => s.categoria === catAtiva)

  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="section-badge">Nossos Serviços</span>
          <h1 className="page-hero-title">
            Transformações <span className="gradient-text">sofisticadas</span>
          </h1>
          <p className="page-hero-subtitle">
            Cada tratamento é uma experiência única que combina técnica, beleza e cuidado personalizado.
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="section" style={{ background: 'var(--cream)', paddingTop: '3rem', paddingBottom: '0' }}>
        <div className="container">
          <div className="filter-tabs">
            {CATEGORIAS.map(cat => (
              <button
                key={cat}
                className={`filter-tab${catAtiva === cat ? ' active' : ''}`}
                onClick={() => setCatAtiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRADE DE SERVIÇOS */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="grid-3">
            {filtrados.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 80} className="service-card">
                <div className="service-card-icon"><ServiceIcon nome={s.nome} categoria={s.categoria} /></div>
                <span className="service-card-category">{s.categoria}</span>
                <h3 className="service-card-title">{s.nome}</h3>
                <p className="service-card-desc">{s.descricao}</p>
                <div className="service-card-footer">
                  <div>
                    <small className="service-card-from">A partir de</small>
                    <strong className="service-card-price">R$ {s.preco.toFixed(2)}</strong>
                  </div>
                  <span className="service-card-duration">{s.duracao} min</span>
                </div>
                <Link to="/agendamento" className="btn btn-primary btn-full" style={{ marginTop: '1.25rem' }}>
                  Agendar este serviço
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-dark" style={{ padding: '5rem 1rem' }}>
        <div className="hero-dark-glow" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: '#fff', fontSize: '2rem' }}>
            Precisa de ajuda para <span style={{ color: 'var(--gold-light)' }}>escolher?</span>
          </h2>
          <p style={{ color: 'rgba(253,248,243,0.7)', maxWidth: '420px', margin: '1rem auto 2rem', lineHeight: 1.8 }}>
            Nossa equipe está pronta para orientar você na escolha do serviço ideal.
          </p>
          <Link to="/contato" className="btn btn-gold btn-lg">Falar com um especialista</Link>
        </div>
      </section>
    </div>
  )
}
