import { Routes, Route } from 'react-router-dom'
import PlansFormation from './pages/PlansFormation'
import HistoriqueFormation from './pages/HistoriqueFormation'
import EvaluationFormation from './pages/EvaluationFormation'

export default function FormationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PlansFormation />} />
      <Route path="historique" element={<HistoriqueFormation />} />
      <Route path="evaluation" element={<EvaluationFormation />} />
    </Routes>
  )
}

