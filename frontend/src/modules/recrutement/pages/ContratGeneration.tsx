import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { toast } from 'react-toastify'

export default function ContratGeneration() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: candidature } = useQuery({
    queryKey: ['candidature', id],
    queryFn: async () => {
      const response = await api.get(`/api/recrutement/candidatures/${id}`)
      return response.data
    },
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/api/recrutement/candidatures/${id}/contrat`)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Contrat généré avec succès')
      // Download the contract
      window.open(data.url, '_blank')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la génération')
    },
  })

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
          <h1 className="text-3xl font-bold text-gray-800">Génération de contrat</h1>
          <p className="text-gray-600 mt-2">
            {candidature?.prenom} {candidature?.nom}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 bg-primary-100 rounded-lg">
            <FileText className="text-primary-700" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Contrat de travail</h2>
            <p className="text-gray-600">Générer le contrat de travail pour ce candidat</p>
          </div>
        </div>

        {candidature && (
          <div className="space-y-4 mb-6">
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
                <p className="text-sm text-gray-600">Offre</p>
                <p className="font-medium">{candidature.offreLibelle}</p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => mutation.mutate()}
          className="btn-primary flex items-center space-x-2"
          disabled={mutation.isPending}
        >
          <Download size={20} />
          <span>{mutation.isPending ? 'Génération...' : 'Générer le contrat'}</span>
        </button>
      </div>
    </div>
  )
}

