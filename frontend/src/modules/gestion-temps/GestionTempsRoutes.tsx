import { Routes, Route } from 'react-router-dom'
import SuiviTemps from './pages/SuiviTemps'
import HeuresSupplementaires from './pages/HeuresSupplementaires'

export default function GestionTempsRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SuiviTemps />} />
      <Route path="heures-supplementaires" element={<HeuresSupplementaires />} />
    </Routes>
  )
}

