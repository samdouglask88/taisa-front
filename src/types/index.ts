export interface Servico {
  id: string
  nome: string
  descricao: string
  preco: number
  duracao: number
  categoria: string
  icone: string
}

export interface Horario {
  hora: string
  disponivel: boolean
}

export interface Agendamento {
  id: string
  cliente: string
  servico: string
  data: string
  hora: string
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado'
  valor: number
  telefone: string
  email: string
}

export interface Depoimento {
  id: string
  nome: string
  texto: string
  avaliacao: number
  servico: string
  foto?: string
}

export interface Cliente {
  _id: string
  name: string
  email: string
  phone: string
  address?: string
  instagram?: string
  createdAt: string
}

export interface User {
  email: string
  nome: string
  role: 'admin' | 'user'
}

export interface BookingStep {
  servico: Servico | null
  data: string
  hora: string
  nome: string
  email: string
  telefone: string
  observacoes: string
}
