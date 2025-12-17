import { Routes, Route } from 'react-router-dom'
import ParametrageLayout from './ParametrageLayout'
import Competences from './pages/Competences'
import Domaines from './pages/Domaines'
import Fonctions from './pages/Fonctions'
import NiveauxEtude from './pages/NiveauxEtude'
import Profils from './pages/Profils'

export default function ParametrageRoutes() {
  return (
    <Routes>
      <Route element={<ParametrageLayout />}>
        <Route index element={<Competences />} />
        <Route path="competences" element={<Competences />} />
        <Route path="domaines" element={<Domaines />} />
        <Route path="fonctions" element={<Fonctions />} />
        <Route path="niveaux-etude" element={<NiveauxEtude />} />
        <Route path="profils" element={<Profils />} />
      </Route>
    </Routes>
  )
}

