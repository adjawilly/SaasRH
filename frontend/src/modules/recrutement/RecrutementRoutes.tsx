import { Routes, Route } from 'react-router-dom'
import OffresList from './pages/OffresList'
import CreateOffre from './pages/CreateOffre'
import CandidaturesList from './pages/CandidaturesList'
import CandidatureDetail from './pages/CandidatureDetail'
import Preselection from './pages/Preselection'
import EntretienNotation from './pages/EntretienNotation'
import ContratGeneration from './pages/ContratGeneration'
import Onboarding from './pages/Onboarding'

export default function RecrutementRoutes() {
  return (
    <Routes>
      <Route path="/" element={<OffresList />} />
      <Route path="nouvelle-offre" element={<CreateOffre />} />
      <Route path="modifier-offre/:id" element={<CreateOffre />} />
      <Route path="candidatures" element={<CandidaturesList />} />
      <Route path="candidatures/:id" element={<CandidatureDetail />} />
      <Route path="preselection" element={<Preselection />} />
      <Route path="entretien/:id" element={<EntretienNotation />} />
      <Route path="contrat/:id" element={<ContratGeneration />} />
      <Route path="onboarding/:id" element={<Onboarding />} />
    </Routes>
  )
}

