import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import type { ApiLoginResponse } from '../types/api'
import { apiFetch } from '../services/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicialização lazy: restaura a sessão salva uma única vez, sem useEffect
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('taisa_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const data = await apiFetch<ApiLoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: senha }),
      })
      const loggedUser: User = { email: data.user.email, nome: data.user.name, role: 'admin' }
      localStorage.setItem('taisa_token', data.token)
      localStorage.setItem('taisa_user', JSON.stringify(loggedUser))
      setUser(loggedUser)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    // Revoga o token no servidor antes de descartá-lo localmente;
    // se a chamada falhar (servidor fora do ar), o logout local acontece igual.
    apiFetch('/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
    localStorage.removeItem('taisa_user')
    localStorage.removeItem('taisa_token')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- padrão consagrado: provider e hook no mesmo arquivo
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
