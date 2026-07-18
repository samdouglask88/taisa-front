import { useState } from 'react'
import { CheckCircle2, Phone, Clock, MessageCircle } from 'lucide-react'
import { SITE, whatsappUrl } from '../config/site'

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
                <span className="alert-icon"><CheckCircle2 size={20} /></span>
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
                titulo: 'Informações de contato', Icone: Phone,
                itens: [
                  { label: 'Telefone', valor: SITE.telefoneExibicao },
                  { label: 'E-mail', valor: SITE.email },
                  { label: 'Endereço', valor: SITE.cidade },
                ]
              },
              {
                titulo: 'Horários de funcionamento', Icone: Clock,
                itens: [...SITE.horarios],
              },
            ].map(card => (
              <div key={card.titulo} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div className="contact-info-icon"><card.Icone size={20} /></div>
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
              href={whatsappUrl('Olá! Vim pelo site e gostaria de mais informações.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-full btn-lg"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <MessageCircle size={20} />
              Chamar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
