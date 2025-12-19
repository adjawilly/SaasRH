import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../../api'
import { ArrowLeft, Download, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export default function CandidatureDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: candidature, isLoading } = useQuery({
    queryKey: ['candidature', id],
    queryFn: async () => {
      const response = await api.get(`/api/recrutement/candidatures/${id}`)
      return response.data
    },
  })

  if (isLoading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  if (!candidature) {
    return <div className="text-center py-12">Candidature non trouvée</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/recrutement/candidatures')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {candidature.prenom} {candidature.nom}
          </h1>
          <p className="text-gray-600 mt-2">Détails de la candidature</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
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

          <div className="card">
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
                <div className="flex flex-wrap gap-2">
                  {candidature.competences?.map((comp: string) => (
                    <span
                      key={comp}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
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
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Download size={20} />
                  <span>Télécharger le CV</span>
                </a>
              )}
              {candidature.lmUrl && (
                <a
                  href={candidature.lmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Download size={20} />
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
                  {format(new Date(candidature.dateDepot), 'dd MMM yyyy', { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Offre</p>
                <p className="font-medium">{candidature.offreLibelle}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate(`/recrutement/preselection?candidature=${candidature.id}`)}
                className="w-full btn-primary"
              >
                Présélectionner
              </button>
              <button
                onClick={() => navigate(`/recrutement/entretien/${candidature.id}`)}
                className="w-full btn-secondary"
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

