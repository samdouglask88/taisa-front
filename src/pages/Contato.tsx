import { useState } from 'react'

interface FormData { nome: string; email: string; telefone: string; assunto: string; mensagem: string }
const EMPTY: FormData = { nome: '', email: '', telefone: '', assunto: '', mensagem: '' }

export default function Contato() {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setSubmitted(true)
    setForm(EMPTY)
    setLoading(false)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="section-badge">Contato</span>
          <h1 className="page-hero-title">Estamos prontas para <span className="gradient-text">ouvir você</span></h1>
          <p className="page-hero-subtitle">
            Deixe sua mensagem e nossa equipe entrará em contato rapidamente para garantir a melhor experiência.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container contact-grid">

          {/* Formulário */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--wine-dark)', marginBottom: '1.5rem' }}>
              Envie sua mensagem
            </h2>

            {submitted && (
              <div className="alert-success">
                <span className="alert-icon">✓</span>
                <div>
                  <strong>Mensagem enviada!</strong>
                  <p>Retornaremos em breve por e-mail ou WhatsApp.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Nome completo</label>
                <input className="form-input" type="text" name="nome" value={form.nome} onChange={handle} required placeholder="Seu nome completo" />
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input className="form-input" type="email" name="email" value={form.email} onChange={handle} required placeholder="seu@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input className="form-input" type="tel" name="telefone" value={form.telefone} onChange={handle} required placeholder="(11) 98765-4321" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Assunto</label>
                <select className="form-select" name="assunto" value={form.assunto} onChange={handle} required>
                  <option value="">Selecione um assunto</option>
                  <option value="agendamento">Dúvida sobre agendamento</option>
                  <option value="servico">Informações sobre serviços</option>
                  <option value="feedback">Feedback / Sugestão</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mensagem</label>
                <textarea className="form-textarea" name="mensagem" value={form.mensagem} onChange={handle} required rows={5} placeholder="Escreva sua mensagem aqui..." />
              </div>

              <button type="submit" className={`btn btn-primary btn-full${loading ? ' btn-loading' : ''}`} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </form>
          </div>

          {/* Informações */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              {
                titulo: 'Informações de contato', icone: '📞',
                itens: [
                  { label: 'Telefone', valor: '(11) 98765-4321' },
                  { label: 'E-mail', valor: 'contato@taisa.com.br' },
                  { label: 'Endereço', valor: 'São Paulo, SP' },
                ]
              },
              {
                titulo: 'Horários de funcionamento', icone: '🕐',
                itens: [
                  { label: 'Seg – Sex', valor: '09h às 19h' },
                  { label: 'Sábado', valor: '10h às 17h' },
                  { label: 'Domingo', valor: 'Fechado' },
                ]
              },
            ].map(card => (
              <div key={card.titulo} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div className="contact-info-icon">{card.icone}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--wine-dark)' }}>{card.titulo}</h3>
                </div>
                <dl className="contact-info-list">
                  {card.itens.map(row => (
                    <div key={row.label} className="contact-info-row">
                      <dt>{row.label}</dt>
                      <dd style={{ color: row.valor === 'Fechado' ? 'var(--rose)' : 'var(--wine-dark)', fontWeight: 600 }}>{row.valor}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}

            {/* WhatsApp destaque */}
            <a
              href="https://wa.me/5511987654321"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-full btn-lg"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
