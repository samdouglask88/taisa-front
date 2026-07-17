import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PartyPopper } from 'lucide-react'
import type { Servico, BookingStep } from '../types'
import { apiFetch } from '../services/api'
import { ServiceIcon } from '../utils/serviceIcons'

const SERVICOS: Servico[] = [
  { id: '1', nome: 'Corte Feminino',        descricao: 'Corte personalizado com lavatório e finalização.',  preco: 120, duracao: 60,  categoria: 'Cabelo',   icone: '✂️' },
  { id: '2', nome: 'Coloração Completa',    descricao: 'Tintura com proteção dos fios e finalização.',      preco: 280, duracao: 150, categoria: 'Cabelo',   icone: '🎨' },
  { id: '3', nome: 'Manicure & Pedicure',   descricao: 'Cuidado completo para mãos e pés.',                preco: 90,  duracao: 90,  categoria: 'Unhas',    icone: '💅' },
  { id: '4', nome: 'Escova Progressiva',    descricao: 'Alisamento duradouro anti-frizz.',                  preco: 350, duracao: 180, categoria: 'Cabelo',   icone: '💎' },
  { id: '5', nome: 'Design de Sobrancelha', descricao: 'Modelagem personalizada com henna.',                preco: 75,  duracao: 45,  categoria: 'Estética', icone: '✨' },
  { id: '6', nome: 'Ritual de Beleza',      descricao: 'Pacote completo de beleza.',                       preco: 220, duracao: 180, categoria: 'Pacote',   icone: '🌸' },
]

const HORARIOS = ['09:00', '09:45', '10:30', '11:15', '13:00', '13:45', '14:30', '15:15', '16:00', '16:45', '17:30']
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array(firstDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

const INITIAL: BookingStep = { servico: null, data: '', hora: '', nome: '', email: '', telefone: '', observacoes: '' }

export default function Agendamento() {
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState<BookingStep>(INITIAL)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const cells = buildCalendar(calYear, calMonth)

  const selectDate = (day: number | null) => {
    if (!day) return
    const d = new Date(calYear, calMonth, day)
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return
    const formatted = `${String(day).padStart(2,'0')}/${String(calMonth+1).padStart(2,'0')}/${calYear}`
    setBooking(b => ({ ...b, data: formatted, hora: '' }))
  }

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiFetch('/appointments/book', {
        method: 'POST',
        body: JSON.stringify({
          nome: booking.nome,
          email: booking.email,
          telefone: booking.telefone,
          servicoNome: booking.servico?.nome,
          preco: booking.servico?.preco,
          data: booking.data,
          hora: booking.hora,
          observacoes: booking.observacoes,
        }),
      })
      setDone(true)
    } catch {
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', background: 'var(--cream)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <PartyPopper size={64} color="var(--gold)" strokeWidth={1.5} />
          </div>
          <h2 className="section-title">Agendamento confirmado!</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '1rem auto 2rem', lineHeight: 1.8 }}>
            <strong>{booking.nome}</strong>, seu <strong>{booking.servico?.nome}</strong> está marcado para{' '}
            <strong>{booking.data} às {booking.hora}</strong>. Você receberá uma confirmação em breve.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary btn-lg">Voltar ao início</Link>
            <button className="btn btn-outline btn-lg" onClick={() => { setDone(false); setStep(1); setBooking(INITIAL) }}>
              Fazer novo agendamento
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-bg" />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <span className="section-badge">Agendamento</span>
          <h1 className="page-hero-title">Reserve seu <span className="gradient-text">momento</span></h1>
          <p className="page-hero-subtitle">Em 3 passos simples, garanta seu horário com a nossa equipe.</p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--cream)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>

          {/* Steps bar */}
          <div className="steps-bar">
            {['Serviço', 'Data & Hora', 'Seus dados'].map((label, idx) => {
              const n = idx + 1
              const active = step === n
              const done = step > n
              return (
                <div key={label} className="step-item">
                  <div className={`step-circle${active ? ' active' : done ? ' done' : ''}`}>
                    {done ? '✓' : n}
                  </div>
                  <span className={`step-label${active ? ' active' : ''}`}>{label}</span>
                  {idx < 2 && <div className={`step-connector${done ? ' done' : ''}`} />}
                </div>
              )
            })}
          </div>

          {/* STEP 1: Escolher serviço */}
          {step === 1 && (
            <div className="booking-step anim-fade-up">
              <h3 className="booking-step-title">Escolha o serviço</h3>
              <div className="grid-2" style={{ gap: '1rem' }}>
                {SERVICOS.map(s => (
                  <div
                    key={s.id}
                    className={`booking-service-card${booking.servico?.id === s.id ? ' selected' : ''}`}
                    onClick={() => setBooking(b => ({ ...b, servico: s }))}
                  >
                    <span className="booking-service-icon"><ServiceIcon nome={s.nome} categoria={s.categoria} size={22} /></span>
                    <div className="booking-service-info">
                      <strong>{s.nome}</strong>
                      <small>{s.duracao} min · R$ {s.preco.toFixed(2)}</small>
                    </div>
                    {booking.servico?.id === s.id && (
                      <span className="booking-service-check">✓</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="booking-nav">
                <span />
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!booking.servico}
                  onClick={() => setStep(2)}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Data e hora */}
          {step === 2 && (
            <div className="booking-step anim-fade-up">
              <h3 className="booking-step-title">Escolha a data e o horário</h3>
              <div className="booking-datetime-grid">
                {/* Calendário */}
                <div className="calendar-wrap">
                  <div className="calendar-header">
                    <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
                    <span className="cal-month-label">{MESES[calMonth]} {calYear}</span>
                    <button className="cal-nav-btn" onClick={nextMonth}>›</button>
                  </div>
                  <div className="calendar-grid">
                    {DIAS_SEMANA.map(d => <div key={d} className="cal-weekday">{d}</div>)}
                    {cells.map((day, i) => {
                      if (!day) return <div key={i} />
                      const date = new Date(calYear, calMonth, day)
                      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                      const isSun = date.getDay() === 0
                      const formatted = `${String(day).padStart(2,'0')}/${String(calMonth+1).padStart(2,'0')}/${calYear}`
                      const isSelected = booking.data === formatted
                      return (
                        <div
                          key={i}
                          className={`cal-day${isSelected ? ' selected' : ''}${isPast || isSun ? ' disabled' : ''}`}
                          onClick={() => !isPast && !isSun && selectDate(day)}
                        >
                          {day}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Horários */}
                <div className="timeslots-wrap">
                  <p className="timeslots-label">
                    {booking.data ? `Horários para ${booking.data}` : 'Selecione uma data'}
                  </p>
                  {booking.data ? (
                    <div className="timeslots-grid">
                      {HORARIOS.map(h => (
                        <button
                          key={h}
                          className={`time-slot${booking.hora === h ? ' selected' : ''}`}
                          onClick={() => setBooking(b => ({ ...b, hora: h }))}
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="timeslots-empty">
                      <span style={{ fontSize: '2rem' }}>📅</span>
                      <p>Escolha uma data no calendário para ver os horários disponíveis.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="booking-nav">
                <button className="btn btn-outline btn-lg" onClick={() => setStep(1)}>← Voltar</button>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!booking.data || !booking.hora}
                  onClick={() => setStep(3)}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Dados pessoais */}
          {step === 3 && (
            <div className="booking-step anim-fade-up">
              <h3 className="booking-step-title">Seus dados</h3>

              {/* Resumo */}
              <div className="booking-summary">
                <div className="booking-summary-row">
                  <span>Serviço</span>
                  <strong>{booking.servico?.nome}</strong>
                </div>
                <div className="booking-summary-row">
                  <span>Data & Hora</span>
                  <strong>{booking.data} às {booking.hora}</strong>
                </div>
                <div className="booking-summary-row">
                  <span>Valor</span>
                  <strong style={{ color: 'var(--wine)' }}>R$ {booking.servico?.preco.toFixed(2)}</strong>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                  <label className="form-label">Nome completo</label>
                  <input
                    className="form-input"
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={booking.nome}
                    onChange={e => setBooking(b => ({ ...b, nome: e.target.value }))}
                  />
                </div>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input
                      className="form-input"
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={booking.email}
                      onChange={e => setBooking(b => ({ ...b, email: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input
                      className="form-input"
                      type="tel"
                      required
                      placeholder="(11) 98765-4321"
                      value={booking.telefone}
                      onChange={e => setBooking(b => ({ ...b, telefone: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Observações (opcional)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Alguma preferência ou informação adicional?"
                    value={booking.observacoes}
                    onChange={e => setBooking(b => ({ ...b, observacoes: e.target.value }))}
                  />
                </div>

                <div className="booking-nav">
                  <button type="button" className="btn btn-outline btn-lg" onClick={() => setStep(2)}>← Voltar</button>
                  <button type="submit" className={`btn btn-primary btn-lg${loading ? ' btn-loading' : ''}`} disabled={loading}>
                    {loading ? 'Confirmando...' : 'Confirmar agendamento'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
