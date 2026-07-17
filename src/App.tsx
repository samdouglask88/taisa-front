import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'
import Servicos from './pages/Servicos'
import Agendamento from './pages/Agendamento'
import Galeria from './pages/Galeria'
import Contato from './pages/Contato'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const NO_LAYOUT_ROUTES = ['/login', '/dashboard']

function AppContent() {
  const location = useLocation()
  const noLayout = NO_LAYOUT_ROUTES.some(r => location.pathname.startsWith(r))

  return (
    <>
      {!noLayout && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!noLayout && <Footer />}
      {!noLayout && <WhatsAppFloat />}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}
