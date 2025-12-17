import { Routes, Route } from 'react-router-dom'
import ObjectifsList from './pages/ObjectifsList'
import AutoEvaluation from './pages/AutoEvaluation'
import CartographieCompetences from './pages/CartographieCompetences'

export default function EvaluationRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ObjectifsList />} />
      <Route path="auto-evaluation" element={<AutoEvaluation />} />
      <Route path="cartographie" element={<CartographieCompetences />} />
    </Routes>
  )
}

