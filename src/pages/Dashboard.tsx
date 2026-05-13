import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Agendamento } from '../types'

const MOCK_AGENDAMENTOS: Agendamento[] = [
  { id: '1', cliente: 'Ana Beatriz Santos',   servico: 'Coloração Completa',    data: '12/05/2026', hora: '10:30', status: 'confirmado', valor: 280, telefone: '(11) 91234-5678', email: 'ana@email.com' },
  { id: '2', cliente: 'Camila Rodrigues',     servico: 'Escova Progressiva',    data: '12/05/2026', hora: '14:00', status: 'pendente',   valor: 350, telefone: '(11) 92345-6789', email: 'camila@email.com' },
  { id: '3', cliente: 'Fernanda Lima',        servico: 'Manicure & Pedicure',   data: '13/05/2026', hora: '09:00', status: 'confirmado', valor: 90,  telefone: '(11) 93456-7890', email: 'fernanda@email.com' },
  { id: '4', cliente: 'Juliana Mendes',       servico: 'Ritual de Beleza',      data: '13/05/2026', hora: '11:00', status: 'concluido',  valor: 220, telefone: '(11) 94567-8901', email: 'juliana@email.com' },
  { id: '5', cliente: 'Letícia Carvalho',     servico: 'Corte Feminino',        data: '14/05/2026', hora: '15:30', status: 'cancelado',  valor: 120, telefone: '(11) 95678-9012', email: 'leticia@email.com' },
  { id: '6', cliente: 'Marina Costa',         servico: 'Design de Sobrancelha', data: '14/05/2026', hora: '16:15', status: 'pendente',   valor: 75,  telefone: '(11) 96789-0123', email: 'marina@email.com' },
  { id: '7', cliente: 'Patrícia Oliveira',    servico: 'Hidratação Profunda',   data: '15/05/2026', hora: '13:00', status: 'confirmado', valor: 160, telefone: '(11) 97890-1234', email: 'patricia@email.com' },
]

const STATUS_MAP = {
  confirmado: { label: 'Confirmado', cls: 'badge-confirmed' },
  pendente:   { label: 'Pendente',   cls: 'badge-pending' },
  concluido:  { label: 'Concluído',  cls: 'badge-done' },
  cancelado:  { label: 'Cancelado',  cls: 'badge-cancelled' },
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Visão Geral', icon: '◉' },
  { id: 'agendamentos', label: 'Agendamentos', icon: '📅' },
  { id: 'clientes', label: 'Clientes', icon: '👤' },
  { id: 'servicos', label: 'Serviços', icon: '✨' },
]

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  const total = MOCK_AGENDAMENTOS.reduce((s, a) => s + (a.status !== 'cancelado' ? a.valor : 0), 0)
  const confirmados = MOCK_AGENDAMENTOS.filter(a => a.status === 'confirmado').length
  const pendentes = MOCK_AGENDAMENTOS.filter(a => a.status === 'pendente').length

  return (
    <div className="dashboard-layout">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
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

      {/* Main */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="sidebar-hamburger" onClick={() => setSidebarOpen(v => !v)}>
              <span /><span /><span />
            </button>
            <div>
              <h1 className="dashboard-title">
                {NAV_ITEMS.find(n => n.id === activeNav)?.label}
              </h1>
              <p className="dashboard-date">12 de maio de 2026</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link to="/" className="btn btn-outline btn-sm">← Ver site</Link>
            <button className="btn btn-primary btn-sm" onClick={handleLogout}>Sair</button>
          </div>
        </header>

        <div className="dashboard-body">

          {/* OVERVIEW */}
          {activeNav === 'overview' && (
            <>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(123,45,62,0.1)', color: 'var(--wine)' }}>📅</div>
                  <div className="metric-info">
                    <span className="metric-label">Agendamentos</span>
                    <strong className="metric-value">{MOCK_AGENDAMENTOS.length}</strong>
                    <small className="metric-sub">Esta semana</small>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon" style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold)' }}>💰</div>
                  <div className="metric-info">
                    <span className="metric-label">Faturamento</span>
                    <strong className="metric-value">R$ {total.toFixed(2)}</strong>
                    <small className="metric-sub">Esta semana</small>
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
              </div>

              <div className="dashboard-section-title">Agendamentos recentes</div>
              <AgendamentosTable data={MOCK_AGENDAMENTOS.slice(0, 5)} />
            </>
          )}

          {/* AGENDAMENTOS */}
          {activeNav === 'agendamentos' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="dashboard-section-title" style={{ marginBottom: 0 }}>Todos os agendamentos</div>
                <Link to="/agendamento" className="btn btn-primary btn-sm">+ Novo agendamento</Link>
              </div>
              <AgendamentosTable data={MOCK_AGENDAMENTOS} />
            </>
          )}

          {/* CLIENTES */}
          {activeNav === 'clientes' && (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--wine-dark)', marginBottom: '0.5rem' }}>
                Gestão de Clientes
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>Funcionalidade em desenvolvimento.</p>
            </div>
          )}

          {/* SERVIÇOS */}
          {activeNav === 'servicos' && (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--wine-dark)', marginBottom: '0.5rem' }}>
                Gestão de Serviços
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>Funcionalidade em desenvolvimento.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function AgendamentosTable({ data }: { data: Agendamento[] }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Serviço</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map(a => {
            const s = STATUS_MAP[a.status]
            return (
              <tr key={a.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div className="table-avatar">{a.cliente[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--wine-dark)', fontSize: '0.875rem' }}>{a.cliente}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.email}</div>
                    </div>
                  </div>
                </td>
                <td>{a.servico}</td>
                <td>{a.data}</td>
                <td>{a.hora}</td>
                <td style={{ fontWeight: 600, color: 'var(--wine)' }}>R$ {a.valor.toFixed(2)}</td>
                <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
