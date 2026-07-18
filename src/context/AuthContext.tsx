import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { apiFetch } from '../services/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('taisa_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      const data = await apiFetch('/auth/login', {
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

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
