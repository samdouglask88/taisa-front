// Shapes das respostas da API (backend usa nomes em inglês;
// os mappers de cada tela convertem para os tipos internos em pt-BR).

export interface ApiService {
  _id: string
  name: string
  description?: string
  price: number
  durationMinutes?: number
  category: string
  active?: boolean
}

export interface ApiAppointment {
  _id: string
  client?: {
    name?: string
    phone?: string
    email?: string
  } | null
  service: string
  date: string
  time: string
  status: string
  price: number
}

export interface ApiLoginResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}
