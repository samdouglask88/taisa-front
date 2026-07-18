import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Agendamento, Cliente } from '../types'
import type { ApiAppointment, ApiService } from '../types/api'
import { apiFetch } from '../services/api'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

// ── Types ────────────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  confirmado: { label: 'Confirmado', cls: 'badge-confirmed' },
  pendente:   { label: 'Pendente',   cls: 'badge-pending' },
  concluido:  { label: 'Concluído',  cls: 'badge-done' },
  cancelado:  { label: 'Cancelado',  cls: 'badge-cancelled' },
  scheduled:  { label: 'Pendente',   cls: 'badge-pending' },
}

const NAV_ITEMS = [
  { id: 'overview',     label: 'Visão Geral',   icon: '◉' },
  { id: 'agendamentos', label: 'Agendamentos',  icon: '📅' },
  { id: 'clientes',     label: 'Clientes',      icon: '👤' },
  { id: 'servicos',     label: 'Serviços',      icon: '✨' },
]

type Period = 'semana' | 'mes' | '6meses'

interface ServicoAdmin {
  id: string
  nome: string
  descricao: string
  preco: number
  duracao: number
  categoria: string
  ativo: boolean
}

// ── Mappers ──────────────────────────────────────────────
function mapAgendamento(a: ApiAppointment): Agendamento {
  return {
    id: a._id,
    cliente: a.client?.name ?? 'Cliente',
    servico: a.service,
    data: a.date,
    hora: a.time,
    status: a.status as Agendamento['status'],
    valor: a.price,
    telefone: a.client?.phone ?? '',
    email: a.client?.email ?? '',
  }
}

function mapServico(s: ApiService): ServicoAdmin {
  return {
    id: s._id,
    nome: s.name,
    descricao: s.description ?? '',
    preco: s.price,
    duracao: s.durationMinutes ?? 0,
    categoria: s.category,
    ativo: s.active ?? true,
  }
}

// ── Chart helpers ─────────────────────────────────────────
function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null
  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/')
    return new Date(Number(y), Number(m) - 1, Number(d))
  }
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : d
}

function buildChartData(agendamentos: Agendamento[], period: Period) {
  const now = new Date()
  const active = agendamentos.filter(a => a.status !== 'cancelado')

  if (period === 'semana') {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const data = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (6 - i))
      return { label: days[d.getDay()], date: d, faturamento: 0, quantidade: 0 }
    })
    active.forEach(a => {
      const d = parseDate(a.data)
      if (!d) return
      const idx = data.findIndex(r =>
        r.date.getDate() === d.getDate() &&
        r.date.getMonth() === d.getMonth() &&
        r.date.getFullYear() === d.getFullYear()
      )
      if (idx >= 0) { data[idx].faturamento += a.valor; data[idx].quantidade += 1 }
    })
    return data.map(({ label, faturamento, quantidade }) => ({ label, faturamento, quantidade }))
  }

  if (period === 'mes') {
    const data = Array.from({ length: 4 }, (_, i) => ({ label: `Sem ${i + 1}`, faturamento: 0, quantidade: 0 }))
    active.forEach(a => {
      const d = parseDate(a.data)
      if (!d) return
      const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
      if (diffDays < 0 || diffDays > 29) return
      const weekIdx = 3 - Math.floor(diffDays / 7)
      if (weekIdx >= 0 && weekIdx < 4) { data[weekIdx].faturamento += a.valor; data[weekIdx].quantidade += 1 }
    })
    return data
  }

  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const data = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { label: months[d.getMonth()], month: d.getMonth(), year: d.getFullYear(), faturamento: 0, quantidade: 0 }
  })
  active.forEach(a => {
    const d = parseDate(a.data)
    if (!d) return
    const idx = data.findIndex(r => r.month === d.getMonth() && r.year === d.getFullYear())
    if (idx >= 0) { data[idx].faturamento += a.valor; data[idx].quantidade += 1 }
  })
  return data.map(({ label, faturamento, quantidade }) => ({ label, faturamento, quantidade }))
}

function buildServicesRanking(agendamentos: Agendamento[]) {
  const map: Record<string, { count: number; revenue: number }> = {}
  agendamentos.filter(a => a.status !== 'cancelado').forEach(a => {
    if (!map[a.servico]) map[a.servico] = { count: 0, revenue: 0 }
    map[a.servico].count += 1
    map[a.servico].revenue += a.valor
  })
  return Object.entries(map)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.count - a.count)
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ value?: number | string }>
  label?: string
}

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      <p className="chart-tooltip-value">R$ {Number(payload[0]?.value ?? 0).toFixed(2)}</p>
      {payload[1] && <p className="chart-tooltip-qty">{payload[1].value} atend.</p>}
    </div>
  )
}

// ── Dashboard (main) ─────────────────────────────────────
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('mes')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  useEffect(() => {
    Promise.all([
      apiFetch<ApiAppointment[]>('/appointments').catch(() => [] as ApiAppointment[]),
      apiFetch<Cliente[]>('/clients').catch(() => [] as Cliente[]),
    ]).then(([apps, clients]) => {
      setAgendamentos(apps.map(mapAgendamento))
      setClientes(clients)
    }).finally(() => setLoading(false))
  }, [])

  const hoje = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
  const todayStr = new Date().toLocaleDateString('pt-BR')

  const active = agendamentos.filter(a => a.status !== 'cancelado')
  const totalFaturamento = active.reduce((s, a) => s + a.valor, 0)
  const confirmados = agendamentos.filter(a => a.status === 'confirmado').length
  const pendentes = agendamentos.filter(a => a.status === 'pendente' || (a.status as string) === 'scheduled').length
  const concluidos = agendamentos.filter(a => a.status === 'concluido').length
  const cancelados = agendamentos.filter(a => a.status === 'cancelado').length
  const ticketMedio = active.length > 0 ? totalFaturamento / active.length : 0
  const taxaConclusao = agendamentos.length > 0 ? Math.round((concluidos / agendamentos.length) * 100) : 0
  const agendamentosHoje = agendamentos.filter(a => a.data === todayStr).length

  const handleUpdateCliente = (id: string, data: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => c._id === id ? { ...c, ...data } : c))
  }

  const handleStatusChange = async (id: string, novoStatus: string) => {
    try {
      await apiFetch(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify({ status: novoStatus }) })
      setAgendamentos(prev => prev.map(a => a.id === id ? { ...a, status: novoStatus as Agendamento['status'] } : a))
    } catch { /* falha de rede: mantém o estado atual da tela */ }
  }

  const servicesRanking = useMemo(() => buildServicesRanking(agendamentos), [agendamentos])
  const servicoTop = servicesRanking[0]?.name ?? '—'
  const chartData = useMemo(() => buildChartData(agendamentos, period), [agendamentos, period])
  const chartMax = Math.max(...chartData.map(d => d.faturamento), 100)

  return (
    <div className="dashboard-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">T</div>
          <div>
            <strong className="sidebar-brand-name">Taisa Ateliê</strong>
            <small className="sidebar-brand-role">Painel Admin</small>
          </div>
        </div>
        <div className="sidebar-divider" />
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`sidebar-link${activeNav === item.id ? ' active' : ''}`}
              onClick={() => { setActiveNav(item.id); setSidebarOpen(false) }}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{user?.nome[0] ?? 'A'}</div>
            <div>
              <strong className="sidebar-user-name">{user?.nome ?? 'Admin'}</strong>
              <small className="sidebar-user-email">{user?.email}</small>
            </div>
          </div>
          <button className="sidebar-logout" onClick={handleLogout} title="Sair">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="sidebar-hamburger" onClick={() => setSidebarOpen(v => !v)}>
              <span /><span /><span />
            </button>
            <div>
              <h1 className="dashboard-title">{NAV_ITEMS.find(n => n.id === activeNav)?.label}</h1>
              <p className="dashboard-date">{hoje}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/" className="btn btn-outline btn-sm">← Ver site</Link>
            <button className="btn btn-primary btn-sm" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <div className="dashboard-body">

          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Carregando dados...
            </div>
          )}

          {!loading && activeNav === 'overview' && (
            <>
              <div className="metrics-grid metrics-grid-wide">
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(123,45,62,0.1)', color: 'var(--wine)' }}>📅</div>
                  <div className="metric-info">
                    <span className="metric-label">Agendamentos</span>
                    <strong className="metric-value">{agendamentos.length}</strong>
                    <small className="metric-sub">Total acumulado</small>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}>💰</div>
                  <div className="metric-info">
                    <span className="metric-label">Faturamento</span>
                    <strong className="metric-value">R$ {totalFaturamento.toFixed(2)}</strong>
                    <small className="metric-sub">Excluindo cancelados</small>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(168,85,247,0.1)', color: '#7c3aed' }}>🎯</div>
                  <div className="metric-info">
                    <span className="metric-label">Ticket Médio</span>
                    <strong className="metric-value">R$ {ticketMedio.toFixed(2)}</strong>
                    <small className="metric-sub">Por atendimento</small>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a' }}>✓</div>
                  <div className="metric-info">
                    <span className="metric-label">Confirmados</span>
                    <strong className="metric-value">{confirmados}</strong>
                    <small className="metric-sub">Aguardando atendimento</small>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(234,179,8,0.1)', color: '#ca8a04' }}>⏳</div>
                  <div className="metric-info">
                    <span className="metric-label">Pendentes</span>
                    <strong className="metric-value">{pendentes}</strong>
                    <small className="metric-sub">Aguardando confirmação</small>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#2563eb' }}>👥</div>
                  <div className="metric-info">
                    <span className="metric-label">Clientes</span>
                    <strong className="metric-value">{clientes.length}</strong>
                    <small className="metric-sub">Cadastrados</small>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>📈</div>
                  <div className="metric-info">
                    <span className="metric-label">Taxa de Conclusão</span>
                    <strong className="metric-value">{taxaConclusao}%</strong>
                    <small className="metric-sub">{concluidos} de {agendamentos.length} concluídos</small>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(244,63,94,0.1)', color: '#e11d48' }}>🚫</div>
                  <div className="metric-info">
                    <span className="metric-label">Cancelamentos</span>
                    <strong className="metric-value">{cancelados}</strong>
                    <small className="metric-sub">Total cancelado</small>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(249,115,22,0.1)', color: '#ea580c' }}>📆</div>
                  <div className="metric-info">
                    <span className="metric-label">Hoje</span>
                    <strong className="metric-value">{agendamentosHoje}</strong>
                    <small className="metric-sub">Agendamentos do dia</small>
                  </div>
                </div>
                <div className="metric-card metric-card-highlight">
                  <div className="metric-icon" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>⭐</div>
                  <div className="metric-info">
                    <span className="metric-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Serviço Top</span>
                    <strong className="metric-value" style={{ color: 'white', fontSize: '1.15rem', lineHeight: 1.3 }}>{servicoTop}</strong>
                    <small className="metric-sub" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      {servicesRanking[0] ? `${servicesRanking[0].count}x realizado` : 'Sem dados'}
                    </small>
                  </div>
                </div>
              </div>

              <div className="analytics-grid">
                <div className="chart-card">
                  <div className="chart-card-header">
                    <div>
                      <h3 className="chart-card-title">Faturamento</h3>
                      <p className="chart-card-sub">Receita por período</p>
                    </div>
                    <div className="period-tabs">
                      {(['semana', 'mes', '6meses'] as Period[]).map(p => (
                        <button key={p} className={`period-tab${period === p ? ' active' : ''}`} onClick={() => setPeriod(p)}>
                          {p === 'semana' ? 'Semana' : p === 'mes' ? 'Mês' : '6 Meses'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="chart-summary-row">
                    <div className="chart-summary-item">
                      <span>Total no período</span>
                      <strong>R$ {chartData.reduce((s, d) => s + d.faturamento, 0).toFixed(2)}</strong>
                    </div>
                    <div className="chart-summary-item">
                      <span>Atendimentos</span>
                      <strong>{chartData.reduce((s, d) => s + d.quantidade, 0)}</strong>
                    </div>
                    <div className="chart-summary-item">
                      <span>Maior dia</span>
                      <strong>R$ {Math.max(...chartData.map(d => d.faturamento)).toFixed(2)}</strong>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFat" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7b2438" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7b2438" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                        tickFormatter={v => v === 0 ? '0' : `${(v/1000).toFixed(0)}k`}
                        domain={[0, chartMax * 1.2]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="faturamento" stroke="#7b2438" strokeWidth={2.5}
                        fill="url(#colorFat)" dot={{ r: 4, fill: '#7b2438', strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: '#c8a040', strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="ranking-card">
                  <div className="chart-card-header" style={{ marginBottom: '1.25rem' }}>
                    <div>
                      <h3 className="chart-card-title">Serviços</h3>
                      <p className="chart-card-sub">Mais realizados</p>
                    </div>
                  </div>
                  {servicesRanking.length === 0 ? (
                    <div className="ranking-empty">Nenhum serviço realizado ainda.</div>
                  ) : (
                    <div className="ranking-list">
                      {servicesRanking.slice(0, 6).map((s, i) => {
                        const pct = servicesRanking[0].count > 0 ? (s.count / servicesRanking[0].count) * 100 : 0
                        return (
                          <div key={s.name} className="ranking-item">
                            <div className="ranking-position">{i + 1}</div>
                            <div className="ranking-info">
                              <div className="ranking-name-row">
                                <span className="ranking-name">{s.name}</span>
                                <span className="ranking-count">{s.count}x</span>
                              </div>
                              <div className="ranking-bar-wrap">
                                <div className="ranking-bar" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="ranking-revenue">R$ {s.revenue.toFixed(2)}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {servicesRanking.length > 0 && (
                    <div className="ranking-chart-wrap">
                      <ResponsiveContainer width="100%" height={120}>
                        <BarChart data={servicesRanking.slice(0, 5)} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                            tickFormatter={v => v.length > 8 ? v.slice(0, 8) + '…' : v} />
                          <YAxis hide />
                          <Tooltip
                            formatter={(v: number | string, name: string) =>
                              name === 'count' ? [`${v} atend.`, 'Qtd'] : [`R$ ${Number(v).toFixed(2)}`, 'Receita']
                            }
                            contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #f0e8e8' }}
                          />
                          <Bar dataKey="count" fill="#7b2438" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              {agendamentos.length > 0 ? (
                <>
                  <div className="dashboard-section-title" style={{ marginTop: '0.5rem' }}>Agendamentos recentes</div>
                  <AgendamentosTable data={agendamentos.slice(0, 5)} />
                </>
              ) : (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', marginTop: '1.5rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Nenhum agendamento ainda. Os novos agendamentos aparecerão aqui.</p>
                </div>
              )}
            </>
          )}

          {!loading && activeNav === 'agendamentos' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="dashboard-section-title" style={{ marginBottom: 0 }}>Todos os agendamentos</div>
                <Link to="/agendamento" className="btn btn-primary btn-sm">+ Novo agendamento</Link>
              </div>
              {agendamentos.length > 0
                ? <AgendamentosTable data={agendamentos} onStatusChange={handleStatusChange} />
                : <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Nenhum agendamento encontrado.</p>
                  </div>
              }
            </>
          )}

          {!loading && activeNav === 'clientes' && (
            <ClientesTab
              clientes={clientes}
              agendamentos={agendamentos}
              onUpdateCliente={handleUpdateCliente}
            />
          )}

          {!loading && activeNav === 'servicos' && <ServicosTab />}
        </div>
      </main>
    </div>
  )
}

// ── Agendamentos Table ────────────────────────────────────
// Status transitions allowed per current status
const STATUS_ACTIONS: Record<string, { status: string; label: string; cls: string }[]> = {
  pendente:   [{ status: 'confirmado', label: 'Confirmar', cls: 'action-confirm' }, { status: 'cancelado', label: 'Cancelar', cls: 'action-cancel' }],
  scheduled:  [{ status: 'confirmado', label: 'Confirmar', cls: 'action-confirm' }, { status: 'cancelado', label: 'Cancelar', cls: 'action-cancel' }],
  confirmado: [{ status: 'concluido',  label: 'Concluir',  cls: 'action-done'    }, { status: 'cancelado', label: 'Cancelar', cls: 'action-cancel' }],
  concluido:  [],
  cancelado:  [],
}

function buildWhatsAppUrl(a: Agendamento, msg: string) {
  const digits = a.telefone.replace(/\D/g, '')
  const phone = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}

function whatsAppMessage(a: Agendamento) {
  const status = a.status
  if (status === 'confirmado') {
    return `Olá ${a.cliente}! 💅 Seu agendamento de *${a.servico}* está confirmado para *${a.data}* às *${a.hora}*. Te esperamos no Taisa Ateliê!`
  }
  if (status === 'cancelado') {
    return `Olá ${a.cliente}, seu agendamento de *${a.servico}* em ${a.data} foi cancelado. Entre em contato para reagendar. 💕`
  }
  return `Olá ${a.cliente}! Lembrete do seu agendamento de *${a.servico}* em *${a.data}* às *${a.hora}*. Te esperamos! 💅`
}

interface TableProps {
  data: Agendamento[]
  onStatusChange?: (id: string, status: string) => Promise<void>
}

function AgendamentosTable({ data, onStatusChange }: TableProps) {
  const [updating, setUpdating] = useState<string | null>(null)

  const handleAction = async (id: string, status: string) => {
    if (!onStatusChange) return
    setUpdating(id)
    await onStatusChange(id, status)
    setUpdating(null)
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Data / Hora</th>
            <th>Valor</th>
            <th>Status</th>
            {onStatusChange && <th>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map(a => {
            const s = STATUS_MAP[a.status] ?? STATUS_MAP['pendente']
            const actions = STATUS_ACTIONS[a.status] ?? []
            const isUpdating = updating === a.id
            const hasPhone = a.telefone && a.telefone.replace(/\D/g, '').length >= 10

            return (
              <tr key={a.id} style={{ opacity: a.status === 'cancelado' ? 0.55 : 1 }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div className="table-avatar">{a.cliente[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--wine-dark)', fontSize: '0.875rem' }}>{a.cliente}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '0.87rem' }}>{a.servico}</td>
                <td>
                  <div style={{ fontSize: '0.87rem', fontWeight: 500, color: 'var(--wine-dark)' }}>{a.data}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.hora}</div>
                </td>
                <td style={{ fontWeight: 600, color: 'var(--wine)' }}>R$ {a.valor.toFixed(2)}</td>
                <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                {onStatusChange && (
                  <td>
                    <div className="appt-actions">
                      {actions.map(act => (
                        <button
                          key={act.status}
                          className={`appt-action-btn ${act.cls}`}
                          disabled={isUpdating}
                          onClick={() => handleAction(a.id, act.status)}
                        >
                          {isUpdating ? '...' : act.label}
                        </button>
                      ))}
                      {hasPhone && (
                        <a
                          className="appt-action-btn action-whatsapp"
                          href={buildWhatsAppUrl(a, whatsAppMessage(a))}
                          target="_blank"
                          rel="noreferrer"
                          title="Abrir WhatsApp"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WA
                        </a>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Serviços Tab ──────────────────────────────────────────
const CATEGORIAS = ['Todos', 'Cabelo', 'Unhas', 'Estética', 'Pacote']
const CATEGORIA_COLORS: Record<string, { bg: string; color: string }> = {
  'Cabelo':   { bg: 'rgba(123,45,62,0.1)',  color: 'var(--wine)' },
  'Unhas':    { bg: 'rgba(201,168,76,0.12)', color: '#8a6a00' },
  'Estética': { bg: 'rgba(59,130,246,0.1)', color: '#2563eb' },
  'Pacote':   { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
}

function ServicosTab() {
  const [servicos, setServicos] = useState<ServicoAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('Todos')
  const [editModal, setEditModal] = useState<ServicoAdmin | 'new' | null>(null)
  const [saving, setSaving] = useState(false)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [priceInput, setPriceInput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch('/services')
      .then((data) => setServicos((data as ApiService[]).map(mapServico)))
      .catch(() => setError('Erro ao carregar serviços.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filtro === 'Todos' ? servicos : servicos.filter(s => s.categoria === filtro)

  const savePrice = async (id: string) => {
    const val = parseFloat(priceInput)
    if (isNaN(val) || val <= 0) { setEditingPrice(null); return }
    const srv = servicos.find(s => s.id === id)
    if (!srv) return
    try {
      await apiFetch(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: srv.nome, description: srv.descricao, price: val, durationMinutes: srv.duracao, category: srv.categoria, active: srv.ativo }),
      })
      setServicos(prev => prev.map(s => s.id === id ? { ...s, preco: val } : s))
    } catch { /* falha de rede: mantém o estado atual da tela */ }
    setEditingPrice(null)
  }

  const toggleAtivo = async (srv: ServicoAdmin) => {
    try {
      await apiFetch(`/services/${srv.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: srv.nome, description: srv.descricao, price: srv.preco, durationMinutes: srv.duracao, category: srv.categoria, active: !srv.ativo }),
      })
      setServicos(prev => prev.map(s => s.id === srv.id ? { ...s, ativo: !s.ativo } : s))
    } catch { /* falha de rede: mantém o estado atual da tela */ }
  }

  const handleSaveModal = async (form: Omit<ServicoAdmin, 'id'>) => {
    setSaving(true)
    try {
      if (editModal === 'new') {
        const created = await apiFetch<ApiService>('/services', {
          method: 'POST',
          body: JSON.stringify({ name: form.nome, description: form.descricao, price: form.preco, durationMinutes: form.duracao, category: form.categoria, active: true }),
        })
        setServicos(prev => [...prev, mapServico(created)])
      } else if (editModal) {
        await apiFetch(`/services/${editModal.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: form.nome, description: form.descricao, price: form.preco, durationMinutes: form.duracao, category: form.categoria, active: form.ativo }),
        })
        setServicos(prev => prev.map(s => s.id === editModal.id ? { ...s, ...form } : s))
      }
      setEditModal(null)
    } catch { /* falha de rede: mantém o estado atual da tela */ }
    setSaving(false)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="dashboard-section-title" style={{ marginBottom: 0 }}>
          Serviços{' '}
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'inherit', fontWeight: 400 }}>
            ({servicos.length})
          </span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setEditModal('new')}>+ Novo Serviço</button>
      </div>

      <div className="servicos-filter-tabs">
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            className={`servicos-filter-tab${filtro === cat ? ' active' : ''}`}
            onClick={() => setFiltro(cat)}
          >
            {cat}
            {cat !== 'Todos' && (
              <span className="servicos-filter-count">
                {servicos.filter(s => s.categoria === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && <p style={{ color: '#e11d48', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Carregando serviços...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>Nenhum serviço nessa categoria.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Categoria</th>
                <th>Duração</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const catStyle = CATEGORIA_COLORS[s.categoria] ?? { bg: 'rgba(0,0,0,0.06)', color: '#555' }
                return (
                  <tr key={s.id} style={{ opacity: s.ativo ? 1 : 0.5 }}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--wine-dark)', fontSize: '0.875rem' }}>{s.nome}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2, maxWidth: 240 }}>{s.descricao}</div>
                    </td>
                    <td>
                      <span className="categoria-badge" style={{ background: catStyle.bg, color: catStyle.color }}>
                        {s.categoria}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.87rem' }}>{s.duracao} min</td>
                    <td>
                      {editingPrice === s.id ? (
                        <div className="price-edit-wrap">
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0 }}>R$</span>
                          <input
                            className="price-edit-input"
                            type="number"
                            step="0.01"
                            min="0"
                            value={priceInput}
                            onChange={e => setPriceInput(e.target.value)}
                            onBlur={() => savePrice(s.id)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') savePrice(s.id)
                              if (e.key === 'Escape') setEditingPrice(null)
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div className="price-display" onClick={() => { setEditingPrice(s.id); setPriceInput(String(s.preco)) }}>
                          <span style={{ fontWeight: 600, color: 'var(--wine)' }}>R$ {s.preco.toFixed(2)}</span>
                          <svg className="price-edit-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        className={`toggle-switch${s.ativo ? ' active' : ''}`}
                        onClick={() => toggleAtivo(s)}
                        title={s.ativo ? 'Clique para desativar' : 'Clique para ativar'}
                      >
                        <span className="toggle-thumb" />
                      </button>
                    </td>
                    <td>
                      <button className="btn-icon-edit" onClick={() => setEditModal(s)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Editar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editModal !== null && (
        <ServicoModal
          servico={editModal === 'new' ? null : editModal}
          saving={saving}
          onSave={handleSaveModal}
          onClose={() => setEditModal(null)}
        />
      )}
    </>
  )
}

// ── Clientes Tab ─────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: 'rgba(123,45,62,0.15)',  color: 'var(--wine)' },
  { bg: 'rgba(201,168,76,0.15)', color: '#8a6a00' },
  { bg: 'rgba(59,130,246,0.12)', color: '#2563eb' },
  { bg: 'rgba(16,185,129,0.12)', color: '#059669' },
  { bg: 'rgba(168,85,247,0.12)', color: '#7c3aed' },
  { bg: 'rgba(249,115,22,0.12)', color: '#ea580c' },
]
function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

interface EnrichedCliente extends Cliente {
  visitas: number
  totalGasto: number
  ultimaVisita: string | null
  ultimoServico: string | null
}

interface ClientesTabProps {
  clientes: Cliente[]
  agendamentos: Agendamento[]
  onUpdateCliente: (id: string, data: Partial<Cliente>) => void
}

function ClientesTab({ clientes, agendamentos, onUpdateCliente }: ClientesTabProps) {
  const [search, setSearch] = useState('')
  const [editModal, setEditModal] = useState<EnrichedCliente | null>(null)
  const [saving, setSaving] = useState(false)

  const now = new Date()

  const enriched: EnrichedCliente[] = useMemo(() => {
    return clientes.map(c => {
      const appts = agendamentos.filter(a => a.email === c.email)
      const active = appts.filter(a => a.status !== 'cancelado')
      const concluidos = appts.filter(a => a.status === 'concluido')
      const visitas = active.length
      const totalGasto = concluidos.reduce((s, a) => s + a.valor, 0)

      const dates = active.map(a => parseDate(a.data)).filter((d): d is Date => d !== null)
      const ultimaVisita = dates.length > 0
        ? new Date(Math.max(...dates.map(d => d.getTime()))).toLocaleDateString('pt-BR')
        : null

      const sorted = [...active].sort((a, b) => {
        const da = parseDate(a.data); const db = parseDate(b.data)
        if (!da || !db) return 0
        return db.getTime() - da.getTime()
      })
      const ultimoServico = sorted[0]?.servico ?? null

      return { ...c, visitas, totalGasto, ultimaVisita, ultimoServico }
    }).sort((a, b) => b.visitas - a.visitas)
  }, [clientes, agendamentos])

  const novosEsteMes = clientes.filter(c => {
    const d = new Date(c.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const recorrentes = enriched.filter(c => c.visitas > 1).length
  const maxVisitas = enriched[0]?.visitas ?? 1

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return enriched
    return enriched.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))
    )
  }, [enriched, search])

  const handleSave = async (id: string, form: Partial<Cliente>) => {
    setSaving(true)
    try {
      await apiFetch(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, instagram: form.instagram ?? '', address: form.address ?? '' }),
      })
      onUpdateCliente(id, form)
      setEditModal(null)
    } catch { /* falha de rede: mantém o estado atual da tela */ }
    setSaving(false)
  }

  return (
    <>
      <div className="clientes-kpis">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#2563eb' }}>👥</div>
          <div className="metric-info">
            <span className="metric-label">Total</span>
            <strong className="metric-value">{clientes.length}</strong>
            <small className="metric-sub">Clientes cadastrados</small>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#059669' }}>🆕</div>
          <div className="metric-info">
            <span className="metric-label">Novos este mês</span>
            <strong className="metric-value">{novosEsteMes}</strong>
            <small className="metric-sub">{now.toLocaleDateString('pt-BR', { month: 'long' })}</small>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'rgba(168,85,247,0.1)', color: '#7c3aed' }}>♻️</div>
          <div className="metric-info">
            <span className="metric-label">Recorrentes</span>
            <strong className="metric-value">{recorrentes}</strong>
            <small className="metric-sub">Mais de 1 visita</small>
          </div>
        </div>
      </div>

      <div className="clientes-search-wrap">
        <input
          className="clientes-search"
          type="text"
          placeholder="Buscar por nome, e-mail ou telefone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            {search ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado ainda.'}
          </p>
        </div>
      ) : (
        <div className="clientes-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contato</th>
                <th>Instagram</th>
                <th>Última visita</th>
                <th>Visitas</th>
                <th>Total gasto</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const col = avatarColor(c.name)
                const digits = c.phone.replace(/\D/g, '')
                const hasPhone = digits.length >= 10
                const waPhone = digits.startsWith('55') ? digits : `55${digits}`
                const waUrl = hasPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(`Olá ${c.name}! 💅`)}` : null
                const pct = maxVisitas > 0 ? (c.visitas / maxVisitas) * 100 : 0

                return (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div className="cliente-avatar" style={{ background: col.bg, color: col.color }}>
                          {c.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--wine-dark)', fontSize: '0.875rem' }}>{c.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.85rem' }}>{c.phone || '—'}</span>
                        {waUrl && (
                          <a className="appt-action-btn action-whatsapp" href={waUrl} target="_blank" rel="noreferrer" title="WhatsApp" style={{ padding: '3px 7px', fontSize: '0.72rem' }}>
                            WA
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      {c.instagram ? (
                        <a className="cliente-instagram" href={`https://instagram.com/${c.instagram.replace('@', '')}`} target="_blank" rel="noreferrer">
                          @{c.instagram.replace('@', '')}
                        </a>
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: c.ultimaVisita ? 'var(--wine-dark)' : 'var(--text-muted)' }}>
                        {c.ultimaVisita ?? '—'}
                      </div>
                      {c.ultimoServico && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>{c.ultimoServico}</div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--wine-dark)', minWidth: '1.5rem' }}>{c.visitas}</span>
                        <div className="cliente-visitas-bar-wrap">
                          <div className="cliente-visitas-bar" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--wine)' }}>R$ {c.totalGasto.toFixed(2)}</td>
                    <td>
                      <button className="btn-icon-edit" onClick={() => setEditModal(c)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Editar
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editModal && (
        <ClienteModal
          cliente={editModal}
          saving={saving}
          onSave={handleSave}
          onClose={() => setEditModal(null)}
        />
      )}
    </>
  )
}

// ── Cliente Modal ─────────────────────────────────────────
interface ClienteModalProps {
  cliente: EnrichedCliente
  saving: boolean
  onSave: (id: string, form: Partial<Cliente>) => void
  onClose: () => void
}

function ClienteModal({ cliente, saving, onSave, onClose }: ClienteModalProps) {
  const [name, setName] = useState(cliente.name)
  const [phone, setPhone] = useState(cliente.phone)
  const [email, setEmail] = useState(cliente.email)
  const [instagram, setInstagram] = useState(cliente.instagram ?? '')
  const [address, setAddress] = useState(cliente.address ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(cliente._id, { name, phone, email, instagram: instagram || undefined, address: address || undefined })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Editar Cliente</h3>
          <button className="modal-close" onClick={onClose} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="modal-stats-row">
          <div className="modal-stat">
            <span>Visitas</span>
            <strong>{cliente.visitas}</strong>
          </div>
          <div className="modal-stat">
            <span>Total gasto</span>
            <strong>R$ {cliente.totalGasto.toFixed(2)}</strong>
          </div>
          <div className="modal-stat">
            <span>Última visita</span>
            <strong>{cliente.ultimaVisita ?? '—'}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" style={{ paddingTop: 14 }}>
          <div className="form-group">
            <label className="modal-label">Nome *</label>
            <input className="modal-input" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="modal-label">Telefone *</label>
              <input className="modal-input" value={phone} onChange={e => setPhone(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="modal-label">Instagram</label>
              <input className="modal-input" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@usuario" />
            </div>
          </div>

          <div className="form-group">
            <label className="modal-label">E-mail *</label>
            <input className="modal-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="modal-label">Endereço</label>
            <input className="modal-input" value={address} onChange={e => setAddress(e.target.value)} placeholder="Rua, número, bairro..." />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className={`btn btn-primary${saving ? ' btn-loading' : ''}`} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Serviço Modal ─────────────────────────────────────────
interface ModalProps {
  servico: ServicoAdmin | null
  saving: boolean
  onSave: (form: Omit<ServicoAdmin, 'id'>) => void
  onClose: () => void
}

function ServicoModal({ servico, saving, onSave, onClose }: ModalProps) {
  const [nome, setNome] = useState(servico?.nome ?? '')
  const [descricao, setDescricao] = useState(servico?.descricao ?? '')
  const [preco, setPreco] = useState(servico ? String(servico.preco) : '')
  const [duracao, setDuracao] = useState(servico ? String(servico.duracao) : '')
  const [categoria, setCategoria] = useState(servico?.categoria ?? 'Cabelo')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      nome,
      descricao,
      preco: parseFloat(preco) || 0,
      duracao: parseInt(duracao) || 0,
      categoria,
      ativo: servico?.ativo ?? true,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{servico ? 'Editar Serviço' : 'Novo Serviço'}</h3>
          <button className="modal-close" onClick={onClose} type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="modal-label">Nome *</label>
            <input
              className="modal-input"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
              placeholder="Ex: Corte Feminino"
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="modal-label">Categoria *</label>
              <select className="modal-input" value={categoria} onChange={e => setCategoria(e.target.value)} required>
                <option>Cabelo</option>
                <option>Unhas</option>
                <option>Estética</option>
                <option>Pacote</option>
              </select>
            </div>
            <div className="form-group">
              <label className="modal-label">Duração (min)</label>
              <input
                className="modal-input"
                type="number"
                min="0"
                value={duracao}
                onChange={e => setDuracao(e.target.value)}
                placeholder="60"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="modal-label">Preço (R$) *</label>
            <input
              className="modal-input"
              type="number"
              step="0.01"
              min="0"
              value={preco}
              onChange={e => setPreco(e.target.value)}
              required
              placeholder="80.00"
            />
          </div>

          <div className="form-group">
            <label className="modal-label">Descrição</label>
            <textarea
              className="modal-input modal-textarea"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Descrição do serviço..."
              rows={3}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className={`btn btn-primary${saving ? ' btn-loading' : ''}`} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
