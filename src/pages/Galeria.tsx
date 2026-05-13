import { useState } from 'react'

const FOTOS = [
  { id: '1', categoria: 'Cabelo',   titulo: 'Coloração Premium',      emoji: '🎨', bg: '#f9e4e8' },
  { id: '2', categoria: 'Unhas',    titulo: 'Manicure Clássica',       emoji: '💅', bg: '#fdf0f0' },
  { id: '3', categoria: 'Cabelo',   titulo: 'Escova Progressiva',      emoji: '💎', bg: '#f0e8f9' },
  { id: '4', categoria: 'Estética', titulo: 'Design de Sobrancelha',   emoji: '✨', bg: '#e8f4f9' },
  { id: '5', categoria: 'Cabelo',   titulo: 'Corte & Estilo',          emoji: '✂️', bg: '#f9ede8' },
  { id: '6', categoria: 'Unhas',    titulo: 'Esmaltação em Gel',       emoji: '🌸', bg: '#f9e4e8' },
  { id: '7', categoria: 'Estética', titulo: 'Maquiagem Social',        emoji: '💄', bg: '#fdf0f0' },
  { id: '8', categoria: 'Cabelo',   titulo: 'Hidratação Intensiva',    emoji: '💧', bg: '#e8f9f4' },
  { id: '9', categoria: 'Unhas',    titulo: 'Spa dos Pés',             emoji: '🌿', bg: '#f0f9e8' },
]

const CATEGORIAS = ['Todos', 'Cabelo', 'Unhas', 'Estética']

export default function Galeria() {
  const [cat, setCat] = useState('Todos')

  const filtradas = cat === 'Todos' ? FOTOS : FOTOS.filter(f => f.categoria === cat)

  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="section-badge">Galeria</span>
          <h1 className="page-hero-title">Nossos <span className="gradient-text">trabalhos</span></h1>
          <p className="page-hero-subtitle">
            Cada transformação conta uma história única de beleza e cuidado.
          </p>
        </div>
      </section>

      {/* FILTROS */}
      <section className="section" style={{ background: 'var(--cream)', paddingTop: '3rem', paddingBottom: '0' }}>
        <div className="container">
          <div className="filter-tabs">
            {CATEGORIAS.map(c => (
              <button
                key={c}
                className={`filter-tab${cat === c ? ' active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container">
          <div className="gallery-grid">
            {filtradas.map(foto => (
              <div key={foto.id} className="gallery-item" style={{ background: foto.bg }}>
                <div className="gallery-placeholder">
                  <span style={{ fontSize: '3.5rem' }}>{foto.emoji}</span>
                </div>
                <div className="gallery-overlay">
                  <span className="gallery-overlay-cat">{foto.categoria}</span>
                  <strong className="gallery-overlay-title">{foto.titulo}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
