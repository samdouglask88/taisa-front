import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Servico {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao?: number;
}

interface Agendamento {
  _id: string;
  cliente: string;
  servico: string;
  data: string;
  hora: string;
  status: 'confirmado' | 'cancelado' | 'concluido';
  avatar?: string;
}

type NavItem = 'dashboard' | 'agendamentos' | 'servicos' | 'clientes';

// ─── Sub-components ───────────────────────────────────────────────────────────
const TaisaLogo = ({ size = 28 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size * (46 / 48)} fill="none" viewBox="0 0 48 46">
    <path
      fill="white"
      d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
    />
  </svg>
);

const NavIcon = ({ id }: { id: NavItem }) => {
  const icons: Record<NavItem, React.ReactNode> = {
    dashboard: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    agendamentos: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    servicos: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    clientes: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  };
  return <>{icons[id]}</>;
};

// ─── Revenue mini bar chart ───────────────────────────────────────────────────
const RevenueChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-medium" style={{ color: 'rgba(134,59,255,0.9)', fontSize: '10px' }}>
            {d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
          </span>
          <div className="w-full rounded-t-md relative overflow-hidden" style={{ height: `${(d.value / max) * 90}px` }}>
            <div
              className="absolute inset-0 rounded-t-md"
              style={{
                background: i === data.length - 1
                  ? 'linear-gradient(180deg, #863bff, #7e14ff)'
                  : 'linear-gradient(180deg, rgba(134,59,255,0.35), rgba(126,20,255,0.2))',
                transition: 'all 0.5s ease',
              }}
            />
          </div>
          <span className="text-xs" style={{ color: 'rgba(134,59,255,0.5)', fontSize: '10px' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  label,
  value,
  sub,
  trend,
  icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  trend?: { value: string; up: boolean };
  icon: React.ReactNode;
  accent: string;
}) => (
  <div
    className="rounded-2xl p-5 relative overflow-hidden"
    style={{
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(134,59,255,0.06)',
      border: '1px solid rgba(134,59,255,0.08)',
    }}
  >
    <div
      className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-8 translate-x-8"
      style={{ background: accent, opacity: 0.08 }}
    />
    <div className="flex items-start justify-between mb-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: accent, boxShadow: `0 4px 12px ${accent}55` }}
      >
        <div style={{ color: 'white' }}>{icon}</div>
      </div>
      {trend && (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: trend.up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: trend.up ? '#10b981' : '#ef4444',
          }}
        >
          {trend.up ? '↑' : '↓'} {trend.value}
        </span>
      )}
    </div>
    <p className="text-2xl font-bold mb-0.5" style={{ color: '#1a0a2e' }}>{value}</p>
    <p className="text-sm font-medium" style={{ color: 'rgba(26,10,46,0.55)' }}>{label}</p>
    {sub && <p className="text-xs mt-1" style={{ color: 'rgba(134,59,255,0.6)' }}>{sub}</p>}
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: Agendamento['status'] }) => {
  const map = {
    confirmado: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', label: 'Confirmado' },
    cancelado: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', label: 'Cancelado' },
    concluido: { bg: 'rgba(134,59,255,0.1)', color: '#863bff', label: 'Concluído' },
  };
  const s = map[status];
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [formData, setFormData] = useState({ nome: '', descricao: '', preco: '', duracao: '' });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:3333/servicos');
      if (res.ok) setServicos(await res.json());
    } catch { /* backend offline - usar mock */ }

    setServicos([
      { _id: '1', nome: 'Corte Feminino', descricao: 'Corte personalizado com lavatório e finalização', preco: 120, duracao: 60 },
      { _id: '2', nome: 'Coloração Completa', descricao: 'Tintura + hidratação profunda', preco: 280, duracao: 150 },
      { _id: '3', nome: 'Manicure + Pedicure', descricao: 'Tratamento completo para mãos e pés', preco: 90, duracao: 90 },
      { _id: '4', nome: 'Escova Progressiva', descricao: 'Alisamento duradouro com proteção térmica', preco: 350, duracao: 180 },
      { _id: '5', nome: 'Design de Sobrancelha', descricao: 'Modelagem + henna ou micropigmentação', preco: 75, duracao: 45 },
    ]);

    setAgendamentos([
      { _id: '1', cliente: 'Maria Silva', servico: 'Corte Feminino', data: today, hora: '09:00', status: 'confirmado' },
      { _id: '2', cliente: 'Ana Rodrigues', servico: 'Coloração Completa', data: today, hora: '10:30', status: 'confirmado' },
      { _id: '3', cliente: 'Juliana Costa', servico: 'Manicure + Pedicure', data: today, hora: '13:00', status: 'concluido' },
      { _id: '4', cliente: 'Beatriz Lima', servico: 'Design de Sobrancelha', data: today, hora: '15:00', status: 'confirmado' },
      { _id: '5', cliente: 'Carla Mendes', servico: 'Escova Progressiva', data: new Date(Date.now() + 86400000).toISOString().split('T')[0], hora: '10:00', status: 'confirmado' },
      { _id: '6', cliente: 'Fernanda Alves', servico: 'Corte Feminino', data: new Date(Date.now() + 86400000).toISOString().split('T')[0], hora: '14:00', status: 'confirmado' },
      { _id: '7', cliente: 'Sofia Barbosa', servico: 'Coloração Completa', data: new Date(Date.now() + 172800000).toISOString().split('T')[0], hora: '11:00', status: 'cancelado' },
    ]);

    setLoading(false);
  };

  const handleLogout = () => { localStorage.removeItem('isLoggedIn'); navigate('/login'); };

  const agendamentosHoje = agendamentos.filter(a => a.data === today);
  const receita = servicos.reduce((s, v) => s + v.preco, 0) * 8;
  const receitaMes = `R$ ${receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const weeklyRevenue = [
    { label: 'Seg', value: 840 },
    { label: 'Ter', value: 1200 },
    { label: 'Qua', value: 960 },
    { label: 'Qui', value: 1450 },
    { label: 'Sex', value: 1800 },
    { label: 'Sáb', value: 2100 },
    { label: 'Hoje', value: 1350 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmitServico = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Servico = {
      _id: editingId || String(Date.now()),
      nome: formData.nome,
      descricao: formData.descricao,
      preco: parseFloat(formData.preco),
      duracao: formData.duracao ? parseInt(formData.duracao) : undefined,
    };
    if (editingId) {
      setServicos(prev => prev.map(s => s._id === editingId ? payload : s));
    } else {
      setServicos(prev => [...prev, payload]);
    }
    setFormData({ nome: '', descricao: '', preco: '', duracao: '' });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (s: Servico) => {
    setFormData({ nome: s.nome, descricao: s.descricao, preco: String(s.preco), duracao: String(s.duracao || '') });
    setEditingId(s._id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir este serviço?')) setServicos(prev => prev.filter(s => s._id !== id));
  };

  const navItems: { id: NavItem; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'agendamentos', label: 'Agendamentos' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'clientes', label: 'Clientes' },
  ];

  // ─── Sidebar ─────────────────────────────────────────────────────────────────
  const Sidebar = (
    <aside
      className="flex flex-col h-screen sticky top-0 transition-all duration-300 shrink-0"
      style={{
        width: sidebarCollapsed ? 72 : 240,
        background: 'linear-gradient(180deg, #0d0620 0%, #1a0a2e 100%)',
        borderRight: '1px solid rgba(134,59,255,0.15)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #863bff, #7e14ff)', boxShadow: '0 4px 12px rgba(134,59,255,0.4)' }}
        >
          <TaisaLogo size={20} />
        </div>
        {!sidebarCollapsed && (
          <div>
            <p className="text-white font-bold text-sm" style={{ fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.2em' }}>TAISA</p>
            <p className="text-xs" style={{ color: 'rgba(237,230,255,0.4)', letterSpacing: '0.15em', fontSize: '9px' }}>ATELIÊ DE BELEZA</p>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(v => !v)}
          className="ml-auto transition-opacity hover:opacity-100"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {sidebarCollapsed ? <polyline points="9 18 15 12 9 6"/> : <polyline points="15 18 9 12 15 6"/>}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {!sidebarCollapsed && (
          <p className="text-xs px-3 mb-2 font-semibold" style={{ color: 'rgba(237,230,255,0.25)', letterSpacing: '0.15em' }}>MENU</p>
        )}
        {navItems.map(item => {
          const active = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className="w-full flex items-center gap-3 rounded-xl transition-all text-left"
              style={{
                padding: sidebarCollapsed ? '10px' : '10px 12px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: active ? 'rgba(134,59,255,0.2)' : 'transparent',
                color: active ? '#ede6ff' : 'rgba(237,230,255,0.45)',
                borderLeft: active ? '3px solid #863bff' : '3px solid transparent',
              }}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <NavIcon id={item.id} />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              {!sidebarCollapsed && active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#863bff' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'rgba(134,59,255,0.08)' }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ background: 'linear-gradient(135deg, #863bff, #47bfff)' }}
            >
              T
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Taisa Admin</p>
              <p className="text-xs truncate" style={{ color: 'rgba(237,230,255,0.4)' }}>admin@taisa.com.br</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="transition-opacity hover:opacity-100 shrink-0"
              style={{ color: 'rgba(237,230,255,0.35)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Sair"
            className="w-full flex items-center justify-center p-2 rounded-xl transition-all hover:bg-red-500/10"
            style={{ color: 'rgba(237,230,255,0.35)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        )}
      </div>
    </aside>
  );

  // ─── Dashboard view ───────────────────────────────────────────────────────────
  const DashboardView = (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Agendamentos Hoje"
          value={String(agendamentosHoje.length)}
          sub="4 confirmados, 1 concluído"
          trend={{ value: '20%', up: true }}
          accent="#863bff"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          }
        />
        <StatCard
          label="Total este Mês"
          value={String(agendamentos.length)}
          sub="vs 89 mês anterior"
          trend={{ value: '15%', up: true }}
          accent="#47bfff"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          }
        />
        <StatCard
          label="Serviços Ativos"
          value={String(servicos.length)}
          sub="Catálogo completo"
          accent="#7e14ff"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          }
        />
        <StatCard
          label="Receita do Mês"
          value={receitaMes}
          sub="Meta: R$ 12.000"
          trend={{ value: '8%', up: true }}
          accent="#10b981"
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          }
        />
      </div>

      {/* Middle row: chart + today schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Revenue chart */}
        <div
          className="lg:col-span-3 rounded-2xl p-5"
          style={{
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(134,59,255,0.06)',
            border: '1px solid rgba(134,59,255,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm" style={{ color: '#1a0a2e' }}>Receita Semanal</h3>
              <p className="text-xs" style={{ color: 'rgba(26,10,46,0.45)' }}>Últimos 7 dias</p>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: 'rgba(134,59,255,0.1)', color: '#863bff' }}
            >
              R$ 9.700 semana
            </span>
          </div>
          <RevenueChart data={weeklyRevenue} />
        </div>

        {/* Today's schedule */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{
            background: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(134,59,255,0.06)',
            border: '1px solid rgba(134,59,255,0.08)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: '#1a0a2e' }}>Agenda de Hoje</h3>
            <span
              className="text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
              style={{ background: '#863bff', color: 'white' }}
            >
              {agendamentosHoje.length}
            </span>
          </div>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '200px' }}>
            {agendamentosHoje.length === 0 ? (
              <p className="text-sm text-center py-4" style={{ color: 'rgba(26,10,46,0.4)' }}>Sem agendamentos hoje</p>
            ) : agendamentosHoje.map((a, i) => (
              <div
                key={a._id}
                className="flex items-center gap-3 p-2.5 rounded-xl"
                style={{ background: i % 2 === 0 ? 'rgba(134,59,255,0.04)' : 'transparent' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, #863bff, #7e14ff)` }}
                >
                  {a.cliente.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: '#1a0a2e' }}>{a.cliente}</p>
                  <p className="text-xs truncate" style={{ color: 'rgba(26,10,46,0.5)' }}>{a.servico}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold" style={{ color: '#863bff' }}>{a.hora}</p>
                  <StatusBadge status={a.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Novo Agendamento', icon: '📅', action: () => setActiveNav('agendamentos') },
          { label: 'Adicionar Serviço', icon: '💅', action: () => { setActiveNav('servicos'); setShowModal(true); } },
          { label: 'Ver Clientes', icon: '👥', action: () => setActiveNav('clientes') },
          { label: 'Relatórios', icon: '📊', action: () => {} },
        ].map(q => (
          <button
            key={q.label}
            onClick={q.action}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl text-center transition-all"
            style={{
              background: 'white',
              border: '1px solid rgba(134,59,255,0.08)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(134,59,255,0.3)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(134,59,255,0.12)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(134,59,255,0.08)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'none';
            }}
          >
            <span className="text-2xl">{q.icon}</span>
            <span className="text-xs font-medium" style={{ color: '#1a0a2e' }}>{q.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Agendamentos view ────────────────────────────────────────────────────────
  const AgendamentosView = (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(134,59,255,0.06)',
        border: '1px solid rgba(134,59,255,0.08)',
      }}
    >
      <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(134,59,255,0.08)' }}>
        <div>
          <h3 className="font-semibold" style={{ color: '#1a0a2e' }}>Todos os Agendamentos</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(26,10,46,0.45)' }}>{agendamentos.length} registros</p>
        </div>
        <div className="flex gap-2">
          {(['todos', 'confirmado', 'concluido', 'cancelado'] as const).map(f => (
            <button
              key={f}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all capitalize"
              style={{
                background: f === 'todos' ? '#863bff' : 'rgba(134,59,255,0.08)',
                color: f === 'todos' ? 'white' : '#863bff',
              }}
            >
              {f === 'todos' ? 'Todos' : f}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'rgba(134,59,255,0.03)' }}>
              {['Cliente', 'Serviço', 'Data', 'Horário', 'Status', 'Ações'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-xs font-semibold" style={{ color: 'rgba(26,10,46,0.5)', letterSpacing: '0.06em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((a, i) => (
              <tr
                key={a._id}
                style={{ borderTop: '1px solid rgba(134,59,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(134,59,255,0.025)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: `hsl(${(i * 47 + 270) % 360}, 70%, 55%)` }}
                    >
                      {a.cliente.charAt(0)}
                    </div>
                    <span className="text-sm font-medium" style={{ color: '#1a0a2e' }}>{a.cliente}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm" style={{ color: 'rgba(26,10,46,0.7)' }}>{a.servico}</td>
                <td className="py-3 px-4 text-sm" style={{ color: 'rgba(26,10,46,0.7)' }}>
                  {new Date(a.data + 'T12:00:00').toLocaleDateString('pt-BR')}
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-semibold" style={{ color: '#863bff' }}>{a.hora}</span>
                </td>
                <td className="py-3 px-4"><StatusBadge status={a.status} /></td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <button
                      className="p-1.5 rounded-lg transition-all text-xs"
                      style={{ color: '#863bff' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(134,59,255,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      className="p-1.5 rounded-lg transition-all"
                      style={{ color: '#ef4444' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ─── Serviços view ────────────────────────────────────────────────────────────
  const ServicosView = (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(134,59,255,0.06)',
        border: '1px solid rgba(134,59,255,0.08)',
      }}
    >
      <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(134,59,255,0.08)' }}>
        <div>
          <h3 className="font-semibold" style={{ color: '#1a0a2e' }}>Catálogo de Serviços</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(26,10,46,0.45)' }}>{servicos.length} serviços cadastrados</p>
        </div>
        <button
          onClick={() => { setEditingId(null); setFormData({ nome: '', descricao: '', preco: '', duracao: '' }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
          style={{
            background: 'linear-gradient(135deg, #863bff, #7e14ff)',
            boxShadow: '0 4px 12px rgba(134,59,255,0.35)',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 20px rgba(134,59,255,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(134,59,255,0.35)')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Serviço
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
        {servicos.map(s => (
          <div
            key={s._id}
            className="rounded-xl p-4 relative group"
            style={{
              background: 'rgba(134,59,255,0.03)',
              border: '1px solid rgba(134,59,255,0.1)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(134,59,255,0.3)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(134,59,255,0.1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(134,59,255,0.1)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm" style={{ color: '#1a0a2e' }}>{s.nome}</h4>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(s)}
                  className="p-1 rounded-lg"
                  style={{ color: '#863bff', background: 'rgba(134,59,255,0.1)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="p-1 rounded-lg"
                  style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-xs mb-3" style={{ color: 'rgba(26,10,46,0.55)' }}>{s.descricao}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold" style={{ color: '#863bff' }}>
                R$ {s.preco.toFixed(2)}
              </span>
              {s.duracao && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ background: 'rgba(71,191,255,0.12)', color: '#47bfff' }}
                >
                  {s.duracao} min
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ─── Clientes view ────────────────────────────────────────────────────────────
  const ClientesView = (
    <div
      className="rounded-2xl p-8 flex flex-col items-center justify-center text-center"
      style={{
        background: 'white',
        minHeight: 300,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid rgba(134,59,255,0.08)',
      }}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: 'rgba(134,59,255,0.08)' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#863bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      </div>
      <h3 className="font-semibold mb-1" style={{ color: '#1a0a2e' }}>Módulo de Clientes</h3>
      <p className="text-sm" style={{ color: 'rgba(26,10,46,0.45)' }}>Em desenvolvimento — em breve disponível</p>
    </div>
  );

  const pageTitle: Record<NavItem, string> = {
    dashboard: 'Dashboard',
    agendamentos: 'Agendamentos',
    servicos: 'Serviços',
    clientes: 'Clientes',
  };

  // ─── Modal ────────────────────────────────────────────────────────────────────
  const Modal = showModal && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(13,6,32,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setEditingId(null); } }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 animate-slide-in"
        style={{
          background: 'white',
          boxShadow: '0 32px 64px rgba(0,0,0,0.3)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg" style={{ color: '#1a0a2e' }}>
            {editingId ? 'Editar Serviço' : 'Novo Serviço'}
          </h3>
          <button
            onClick={() => { setShowModal(false); setEditingId(null); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: 'rgba(26,10,46,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(134,59,255,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmitServico} className="space-y-4">
          {[
            { name: 'nome', label: 'Nome do Serviço', type: 'text', required: true },
            { name: 'descricao', label: 'Descrição', type: 'textarea', required: true },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(26,10,46,0.6)', letterSpacing: '0.06em' }}>
                {f.label.toUpperCase()}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  name={f.name}
                  value={formData[f.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  required={f.required}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{
                    border: '1px solid rgba(134,59,255,0.2)',
                    color: '#1a0a2e',
                    background: 'rgba(134,59,255,0.02)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#863bff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(134,59,255,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(134,59,255,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              ) : (
                <input
                  type={f.type}
                  name={f.name}
                  value={formData[f.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  required={f.required}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: '1px solid rgba(134,59,255,0.2)',
                    color: '#1a0a2e',
                    background: 'rgba(134,59,255,0.02)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#863bff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(134,59,255,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(134,59,255,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              )}
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'preco', label: 'Preço (R$)', type: 'number', step: '0.01', required: true },
              { name: 'duracao', label: 'Duração (min)', type: 'number', step: '15' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'rgba(26,10,46,0.6)', letterSpacing: '0.06em' }}>
                  {f.label.toUpperCase()}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  value={formData[f.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  required={f.required}
                  step={f.step}
                  min="0"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    border: '1px solid rgba(134,59,255,0.2)',
                    color: '#1a0a2e',
                    background: 'rgba(134,59,255,0.02)',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#863bff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(134,59,255,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(134,59,255,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #863bff, #7e14ff)',
                boxShadow: '0 4px 12px rgba(134,59,255,0.35)',
              }}
            >
              {editingId ? 'Atualizar' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={() => { setShowModal(false); setEditingId(null); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                border: '1px solid rgba(134,59,255,0.2)',
                color: '#863bff',
                background: 'rgba(134,59,255,0.04)',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // ─── Layout ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f3eeff' }}>
      {Sidebar}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="h-16 flex items-center justify-between px-6 shrink-0"
          style={{
            background: 'white',
            borderBottom: '1px solid rgba(134,59,255,0.08)',
            boxShadow: '0 1px 8px rgba(134,59,255,0.06)',
          }}
        >
          <div>
            <h2 className="font-bold text-base" style={{ color: '#1a0a2e' }}>{pageTitle[activeNav]}</h2>
            <p className="text-xs" style={{ color: 'rgba(26,10,46,0.4)' }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all relative"
                style={{ background: notifOpen ? 'rgba(134,59,255,0.1)' : 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(134,59,255,0.08)')}
                onMouseLeave={e => { if (!notifOpen) (e.currentTarget.style.background = 'transparent'); }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#863bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: '#863bff', boxShadow: '0 0 0 2px white' }}
                />
              </button>
              {notifOpen && (
                <div
                  className="absolute right-0 top-12 w-72 rounded-2xl p-4 z-40"
                  style={{
                    background: 'white',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(134,59,255,0.1)',
                  }}
                >
                  <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(26,10,46,0.5)', letterSpacing: '0.08em' }}>NOTIFICAÇÕES</p>
                  {[
                    { msg: 'Novo agendamento: Maria Silva às 16h', time: '5 min' },
                    { msg: 'Beatriz Lima confirmou para amanhã', time: '1h' },
                    { msg: 'Lembrete: 3 agendamentos esta tarde', time: '2h' },
                  ].map((n, i) => (
                    <div key={i} className="flex gap-3 py-2" style={{ borderBottom: i < 2 ? '1px solid rgba(134,59,255,0.06)' : 'none' }}>
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: '#863bff' }}
                      />
                      <div>
                        <p className="text-xs" style={{ color: '#1a0a2e' }}>{n.msg}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(26,10,46,0.35)' }}>há {n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #863bff, #47bfff)' }}
            >
              T
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#863bff" strokeWidth="4"/>
                  <path className="opacity-80" fill="#863bff" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <p className="text-sm" style={{ color: 'rgba(134,59,255,0.6)' }}>Carregando...</p>
              </div>
            </div>
          ) : (
            <>
              {activeNav === 'dashboard' && DashboardView}
              {activeNav === 'agendamentos' && AgendamentosView}
              {activeNav === 'servicos' && ServicosView}
              {activeNav === 'clientes' && ClientesView}
            </>
          )}
        </main>
      </div>

      {Modal}
    </div>
  );
};

export default Admin;
