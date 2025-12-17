import { Routes, Route } from 'react-router-dom'
import SalariesList from './pages/SalariesList'
import CreateSalarie from './pages/CreateSalarie'
import ChargerSalaries from './pages/ChargerSalaries'
import DocumentsSalarie from './pages/DocumentsSalarie'
import AffectationSalarie from './pages/AffectationSalarie'
import FichePoste from './pages/FichePoste'
import DossierSalarie from './pages/DossierSalarie'

export default function GestionAdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SalariesList />} />
      <Route path="nouveau" element={<CreateSalarie />} />
      <Route path="charger" element={<ChargerSalaries />} />
      <Route path="documents/:id" element={<DocumentsSalarie />} />
      <Route path="affectation/:id" element={<AffectationSalarie />} />
      <Route path="fiche-poste/:id" element={<FichePoste />} />
      <Route path="dossier/:id" element={<DossierSalarie />} />
    </Routes>
  )
}

