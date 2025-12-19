import { Routes, Route } from 'react-router-dom'
import FormationHome from './pages/FormationHome'
import MesFormations from './pages/MesFormations'
import FormationsSalaries from './pages/FormationsSalaries'
import PlansFormation from './pages/PlansFormation'
import HistoriqueFormation from './pages/HistoriqueFormation'
import EvaluationFormation from './pages/EvaluationFormation'

export default function FormationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FormationHome />} />
      <Route path="mes-formations" element={<MesFormations />} />
      <Route path="formations-salaries" element={<FormationsSalaries />} />
      <Route path="plans" element={<PlansFormation />} />
      <Route path="historique" element={<HistoriqueFormation />} />
      <Route path="evaluation" element={<EvaluationFormation />} />
    </Routes>
  )
}

