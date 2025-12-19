import { Routes, Route } from 'react-router-dom'
import DemandeAdminHome from './pages/DemandeAdminHome'
import DemandesList from './pages/DemandesList'
import DemandesSalaries from './pages/DemandesSalaries'
import DemandeAbsence from './pages/DemandeAbsence'
import DemandeConge from './pages/DemandeConge'
import DemandeAttestation from './pages/DemandeAttestation'
import SoldeConge from './pages/SoldeConge'

export default function DemandeAdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DemandeAdminHome />} />
      <Route path="mes-demandes" element={<DemandesList />} />
      <Route path="demandes-salaries" element={<DemandesSalaries />} />
      <Route path="absence" element={<DemandeAbsence />} />
      <Route path="conge" element={<DemandeConge />} />
      <Route path="attestation" element={<DemandeAttestation />} />
      <Route path="solde-conge" element={<SoldeConge />} />
    </Routes>
  )
}

