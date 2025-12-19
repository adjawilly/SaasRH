import { useQuery, useMutation } from '@tanstack/react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../../../api'
import { CheckCircle, XCircle, UserCheck } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

export default function Preselection() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const candidatureId = searchParams.get('candidature')
  const notification = useNotification()

  const { data: candidature } = useQuery({
    queryKey: ['candidature', candidatureId],
    queryFn: async () => {
      const response = await (api as any).get(`/api/recrutement/candidatures/${candidatureId}`)
      return response.data
    },
    enabled: !!candidatureId,
  })

  const { data: offre } = useQuery({
    queryKey: ['offre', candidature?.offreId],
    queryFn: async () => {
      const response = await (api as any).get(`/api/recrutement/offres/${candidature?.offreId}`)
      return response.data
    },
    enabled: !!candidature?.offreId,
  })

  const mutation = useMutation({
    mutationFn: async (preselectionne: boolean) => {
      const response = await (api as any).post(`/api/recrutement/candidatures/${candidatureId}/preselection`, {
        preselectionne,
      })
      return response.data
    },
    onSuccess: () => {
      notification.success('Présélection effectuée avec succès', 'La candidature a été mise à jour')
      navigate('/recrutement/candidatures')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la présélection')
    },
  })

  if (!candidature || !offre) {
    return <div className="text-center py-12">Chargement...</div>
  }

  const checkCriteres = () => {
    const criteres = {
      domaine: candidature.domaine === offre.domaineActivite,
      competences: candidature.competences?.some((c: string) => offre.competences.includes(c)),
      niveauEtude: candidature.niveauEtude === offre.niveauEtude,
    }
    return criteres
  }

  const criteres = checkCriteres()
  const score = Object.values(criteres).filter(Boolean).length

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
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
          <span>Présélection</span>
        </h1>
        <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Évaluation des critères de sélection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidat</h2>
          <p className="text-lg font-medium">{candidature.prenom} {candidature.nom}</p>
          <p className="text-gray-600">{candidature.email}</p>
        </div>

        <div className="card border-2 border-purple-200 bg-purple-50/30">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Offre</h2>
          <p className="text-lg font-medium">{offre.libelleOffre}</p>
          <p className="text-gray-600">{offre.typeOffre}</p>
        </div>
      </div>

      <div className="card border-2 border-green-200 bg-green-50/30">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Critères de sélection</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {criteres.domaine ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
              <div>
                <p className="font-medium">Domaine d'activité</p>
                <p className="text-sm text-gray-600">
                  Requis: {offre.domaineActivite} | Candidat: {candidature.domaine}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {criteres.competences ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
              <div>
                <p className="font-medium">Compétences</p>
                <p className="text-sm text-gray-600">
                  {criteres.competences ? 'Correspond' : 'Ne correspond pas'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {criteres.niveauEtude ? (
                <CheckCircle className="text-green-500" size={24} />
              ) : (
                <XCircle className="text-red-500" size={24} />
              )}
              <div>
                <p className="font-medium">Niveau d'étude</p>
                <p className="text-sm text-gray-600">
                  Requis: {offre.niveauEtude} | Candidat: {candidature.niveauEtude}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg border-2" style={{ borderColor: '#2F5FD7', background: 'rgba(47, 95, 215, 0.1)' }}>
          <p className="text-sm text-gray-600">Score de correspondance</p>
          <p className="text-3xl font-bold" style={{ color: '#2F5FD7' }}>{score}/3</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-4">
        <button
          onClick={() => mutation.mutate(false)}
          className="px-4 py-2 md:px-6 md:py-2.5 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
          style={{ borderColor: '#dc2626', color: '#dc2626' }}
          disabled={mutation.isPending}
        >
          Rejeter
        </button>
        <button
          onClick={() => mutation.mutate(true)}
          className="px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 text-sm md:text-base"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
            opacity: mutation.isPending ? 0.6 : 1
          }}
          disabled={mutation.isPending}
        >
          Présélectionner
        </button>
      </div>
    </div>
  )
}

