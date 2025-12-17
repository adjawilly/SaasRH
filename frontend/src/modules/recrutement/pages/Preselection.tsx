import { useQuery, useMutation } from '@tanstack/react-query'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'react-toastify'

export default function Preselection() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const candidatureId = searchParams.get('candidature')

  const { data: candidature } = useQuery({
    queryKey: ['candidature', candidatureId],
    queryFn: async () => {
      const response = await axios.get(`/api/recrutement/candidatures/${candidatureId}`)
      return response.data
    },
    enabled: !!candidatureId,
  })

  const { data: offre } = useQuery({
    queryKey: ['offre', candidature?.offreId],
    queryFn: async () => {
      const response = await axios.get(`/api/recrutement/offres/${candidature?.offreId}`)
      return response.data
    },
    enabled: !!candidature?.offreId,
  })

  const mutation = useMutation({
    mutationFn: async (preselectionne: boolean) => {
      const response = await axios.post(`/api/recrutement/candidatures/${candidatureId}/preselection`, {
        preselectionne,
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Présélection effectuée avec succès')
      navigate('/recrutement/candidatures')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la présélection')
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Présélection</h1>
        <p className="text-gray-600 mt-2">Évaluation des critères de sélection</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidat</h2>
          <p className="text-lg font-medium">{candidature.prenom} {candidature.nom}</p>
          <p className="text-gray-600">{candidature.email}</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Offre</h2>
          <p className="text-lg font-medium">{offre.libelleOffre}</p>
          <p className="text-gray-600">{offre.typeOffre}</p>
        </div>
      </div>

      <div className="card">
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

        <div className="mt-6 p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-gray-600">Score de correspondance</p>
          <p className="text-3xl font-bold text-primary-700">{score}/3</p>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => mutation.mutate(false)}
          className="btn-secondary"
          disabled={mutation.isPending}
        >
          Rejeter
        </button>
        <button
          onClick={() => mutation.mutate(true)}
          className="btn-primary"
          disabled={mutation.isPending}
        >
          Présélectionner
        </button>
      </div>
    </div>
  )
}

