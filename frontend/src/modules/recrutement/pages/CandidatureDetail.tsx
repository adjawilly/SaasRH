import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../api'
import { ArrowLeft, Download, CheckCircle, XCircle, User } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function CandidatureDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: candidature, isLoading } = useQuery({
    queryKey: ['candidature', id],
    queryFn: async () => {
      const response = await (api as any).get(`/api/recrutement/candidatures/${id}`)
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
      </div>
    )
  }

  if (!candidature) {
    return (
      <div className="card text-center py-12">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Candidature non trouvée</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <button
          onClick={() => navigate('/recrutement/candidatures')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          style={{ color: '#2F5FD7' }}
        >
          <ArrowLeft size={20} />
        </button>
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
            <User size={28} style={{ color: '#2F5FD7' }} />
            <span>{candidature.prenom} {candidature.nom}</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Détails de la candidature</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <div className="card border-2 border-blue-200 bg-blue-50/30">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-medium">{candidature.nom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Prénom</p>
                <p className="font-medium">{candidature.prenom}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{candidature.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Genre</p>
                <p className="font-medium">{candidature.genre}</p>
              </div>
            </div>
          </div>

          <div className="card border-2 border-purple-200 bg-purple-50/30">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations professionnelles</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Domaine</p>
                <p className="font-medium">{candidature.domaine}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Niveau d'étude</p>
                <p className="font-medium">{candidature.niveauEtude}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Compétences</p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {candidature.competences?.map((comp: string) => (
                    <span
                      key={comp}
                      className="px-2 py-1 bg-blue-100 text-blue-700 border-2 border-blue-200 rounded-lg text-xs md:text-sm"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {candidature.commentaire && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Commentaire</h2>
              <p className="text-gray-700">{candidature.commentaire}</p>
            </div>
          )}

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
            <div className="space-y-2">
              {candidature.cvUrl && (
                <a
                  href={candidature.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:underline transition-colors"
                  style={{ color: '#2F5FD7' }}
                >
                  <Download size={18} />
                  <span>Télécharger le CV</span>
                </a>
              )}
              {candidature.lmUrl && (
                <a
                  href={candidature.lmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:underline transition-colors"
                  style={{ color: '#2F5FD7' }}
                >
                  <Download size={18} />
                  <span>Télécharger la lettre de motivation</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Statut</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Date de dépôt</p>
                <p className="font-medium">
                  {candidature.dateDepot ? (
                    (() => {
                      try {
                        const date = new Date(candidature.dateDepot)
                        if (isNaN(date.getTime())) {
                          return 'Date invalide'
                        }
                        return format(date, 'dd MMM yyyy', { locale: fr })
                      } catch {
                        return 'Date invalide'
                      }
                    })()
                  ) : (
                    'Non renseigné'
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Offre</p>
                <p className="font-medium">{candidature.offreLibelle}</p>
              </div>
            </div>
          </div>

          <div className="card border-2 border-green-200 bg-green-50/30">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/recrutement/preselection?candidature=${candidature.id}`)}
                className="w-full px-4 py-2 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm md:text-base"
                style={{
                  background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
                }}
              >
                Présélectionner
              </button>
              <button
                onClick={() => navigate(`/recrutement/entretien/${candidature.id}`)}
                className="w-full px-4 py-2 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
                style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
              >
                Noter l'entretien
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

