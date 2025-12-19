import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../../api'
import { Eye, Filter, Download, UserCheck } from 'lucide-react'
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
      const response = await (api as any).get(url)
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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 
            className="text-2xl md:text-3xl font-bold flex items-center space-x-2"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            <UserCheck size={28} style={{ color: '#2F5FD7' }} />
            <span>Candidatures</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Gérez les candidatures reçues</p>
        </div>
        <div className="flex space-x-2">
          <button 
            className="px-3 py-2 md:px-4 md:py-2.5 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm md:text-base font-medium"
            style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
          >
            <Filter size={18} />
            <span>Filtrer</span>
          </button>
          <button 
            className="px-3 py-2 md:px-4 md:py-2.5 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors flex items-center space-x-2 text-sm md:text-base font-medium"
            style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
          >
            <Download size={18} />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
        </div>
      ) : (
        <div className="card border-2 border-blue-200 bg-blue-50/30 overflow-x-auto">
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
                    {candidature.dateDepot ? (
                      (() => {
                        try {
                          const date = new Date(candidature.dateDepot)
                          if (isNaN(date.getTime())) {
                            return <span className="text-gray-400">Date invalide</span>
                          }
                          return format(date, 'dd MMM yyyy', { locale: fr })
                        } catch {
                          return <span className="text-gray-400">Date invalide</span>
                        }
                      })()
                    ) : (
                      <span className="text-gray-400">Non renseigné</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(candidature.statut)}`}>
                      {getStatutLabel(candidature.statut)}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/recrutement/candidatures/${candidature.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      style={{ color: '#2F5FD7' }}
                    >
                      <Eye size={18} />
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

