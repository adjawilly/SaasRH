import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../../api'
import { Eye, Filter, Download } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Candidature {
  id: string
  nom: string
  prenom: string
  email: string
  domaine: string
  competences: string[]
  niveauEtude: string
  genre: string
  dateDepot: string
  statut: 'en_attente' | 'preselectionne' | 'rejete' | 'entretien' | 'embauche'
  offreId: string
  offreLibelle: string
}

export default function CandidaturesList() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const offreId = searchParams.get('offre')

  const { data: candidatures, isLoading } = useQuery<Candidature[]>({
    queryKey: ['candidatures', offreId],
    queryFn: async () => {
      const url = offreId 
        ? `/api/recrutement/candidatures?offre=${offreId}`
        : '/api/recrutement/candidatures'
      const response = await api.get(url)
      return response.data
    },
  })

  const getStatutColor = (statut: string) => {
    const colors: Record<string, string> = {
      en_attente: 'bg-yellow-100 text-yellow-800',
      preselectionne: 'bg-blue-100 text-blue-800',
      rejete: 'bg-red-100 text-red-800',
      entretien: 'bg-purple-100 text-purple-800',
      embauche: 'bg-green-100 text-green-800',
    }
    return colors[statut] || 'bg-gray-100 text-gray-800'
  }

  const getStatutLabel = (statut: string) => {
    const labels: Record<string, string> = {
      en_attente: 'En attente',
      preselectionne: 'Présélectionné',
      rejete: 'Rejeté',
      entretien: 'Entretien',
      embauche: 'Embauché',
    }
    return labels[statut] || statut
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Candidatures</h1>
          <p className="text-gray-600 mt-2">Gérez les candidatures reçues</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn-secondary flex items-center space-x-2">
            <Filter size={20} />
            <span>Filtrer</span>
          </button>
          <button className="btn-secondary flex items-center space-x-2">
            <Download size={20} />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Chargement...</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-semibold text-gray-700">Candidat</th>
                <th className="text-left p-4 font-semibold text-gray-700">Offre</th>
                <th className="text-left p-4 font-semibold text-gray-700">Domaine</th>
                <th className="text-left p-4 font-semibold text-gray-700">Date dépôt</th>
                <th className="text-left p-4 font-semibold text-gray-700">Statut</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidatures?.map((candidature) => (
                <tr key={candidature.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{candidature.prenom} {candidature.nom}</p>
                      <p className="text-sm text-gray-500">{candidature.email}</p>
                    </div>
                  </td>
                  <td className="p-4">{candidature.offreLibelle}</td>
                  <td className="p-4">{candidature.domaine}</td>
                  <td className="p-4">
                    {format(new Date(candidature.dateDepot), 'dd MMM yyyy', { locale: fr })}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(candidature.statut)}`}>
                      {getStatutLabel(candidature.statut)}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/recrutement/candidatures/${candidature.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

