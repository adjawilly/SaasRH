import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import CandidaturePublic from './pages/CandidaturePublic'
import Profil from './pages/Profil'
import Notifications from './pages/Notifications'

// Modules
import RecrutementRoutes from './modules/recrutement/RecrutementRoutes'
import GestionAdminRoutes from './modules/gestion-admin/GestionAdminRoutes'
import DemandeAdminRoutes from './modules/demande-admin/DemandeAdminRoutes'
import EvaluationRoutes from './modules/evaluation/EvaluationRoutes'
import GestionTempsRoutes from './modules/gestion-temps/GestionTempsRoutes'
import FormationRoutes from './modules/formation/FormationRoutes'
import ParametrageRoutes from './modules/parametrage/ParametrageRoutes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/candidature/:token" element={<CandidaturePublic />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="recrutement/*" element={<RecrutementRoutes />} />
        <Route path="gestion-admin/*" element={<GestionAdminRoutes />} />
        <Route path="demande-admin/*" element={<DemandeAdminRoutes />} />
        <Route path="evaluation/*" element={<EvaluationRoutes />} />
        <Route path="gestion-temps/*" element={<GestionTempsRoutes />} />
        <Route path="formation/*" element={<FormationRoutes />} />
        <Route path="parametrage/*" element={<ParametrageRoutes />} />
        <Route path="profil" element={<Profil />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
