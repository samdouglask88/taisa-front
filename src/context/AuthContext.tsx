import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, senha: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const CREDENTIALS = { email: 'admin@taisa.com', senha: 'taisa2024' }
const MOCK_USER: User = { email: 'admin@taisa.com', nome: 'Taisa Admin', role: 'admin' }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('taisa_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = async (email: string, senha: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 800))
    if (email === CREDENTIALS.email && senha === CREDENTIALS.senha) {
      setUser(MOCK_USER)
      localStorage.setItem('taisa_user', JSON.stringify(MOCK_USER))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('taisa_user')
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
