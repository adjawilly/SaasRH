import { Routes, Route } from 'react-router-dom'
import DemandesList from './pages/DemandesList'
import DemandeAbsence from './pages/DemandeAbsence'
import DemandeConge from './pages/DemandeConge'
import DemandeAttestation from './pages/DemandeAttestation'
import SoldeConge from './pages/SoldeConge'

export default function DemandeAdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DemandesList />} />
      <Route path="absence" element={<DemandeAbsence />} />
      <Route path="conge" element={<DemandeConge />} />
      <Route path="attestation" element={<DemandeAttestation />} />
      <Route path="solde-conge" element={<SoldeConge />} />
    </Routes>
  )
}

