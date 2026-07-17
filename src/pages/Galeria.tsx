import { useState } from 'react'
import Reveal from '../components/Reveal'
import fotoCabelo from '../assets/photo-1522337360788-8b13dee7a37e.jpg'
import fotoMaquiagem from '../assets/photo-1487412947147-5cebf100ffc2.jpg'
import fotoFacial from '../assets/photo-1570172619644-dfd03ed5d881.jpg'
import fotoUnhas from '../assets/photo-1604654894610-df63bc536371.jpg'
import fotoAmbiente from '../assets/photo-1560066984-138dadb4c035.jpg'

const FOTOS = [
  { id: '1', categoria: 'Ambiente', titulo: 'Nosso espaço',       src: fotoAmbiente,  wide: true },
  { id: '2', categoria: 'Cabelo',   titulo: 'Cuidado e estilo',    src: fotoCabelo },
  { id: '3', categoria: 'Estética', titulo: 'Maquiagem Social',    src: fotoMaquiagem },
  { id: '4', categoria: 'Estética', titulo: 'Ritual Facial',       src: fotoFacial },
  { id: '5', categoria: 'Unhas',    titulo: 'Esmaltação Statement', src: fotoUnhas },
]

const CATEGORIAS = ['Todos', 'Cabelo', 'Unhas', 'Estética', 'Ambiente']

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
            {filtradas.map((foto, i) => (
              <Reveal
                key={foto.id}
                delay={(i % 4) * 70}
                className={`gallery-item${foto.wide ? ' wide' : ''}`}
              >
                <img src={foto.src} alt={foto.titulo} loading="lazy" />
                <div className="gallery-overlay">
                  <span className="gallery-overlay-cat">{foto.categoria}</span>
                  <strong className="gallery-overlay-title">{foto.titulo}</strong>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
