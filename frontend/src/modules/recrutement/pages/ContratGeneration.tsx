import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

export default function ContratGeneration() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notification = useNotification()

  const { data: candidature } = useQuery({
    queryKey: ['candidature', id],
    queryFn: async () => {
      const response = await (api as any).get(`/api/recrutement/candidatures/${id}`)
      return response.data
    },
  })

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await (api as any).post(`/api/recrutement/candidatures/${id}/contrat`)
      return response.data
    },
    onSuccess: (data) => {
      notification.success('Contrat généré avec succès', 'Le contrat est prêt au téléchargement')
      // Download the contract
      window.open(data.url, '_blank')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la génération')
    },
  })

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
            <FileText size={28} style={{ color: '#2F5FD7' }} />
            <span>Génération de contrat</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
            {candidature?.prenom} {candidature?.nom}
          </p>
        </div>
      </div>

      <div className="card border-2 border-blue-200 bg-blue-50/30">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 rounded-lg border-2 bg-white" style={{ borderColor: '#2F5FD7' }}>
            <FileText style={{ color: '#2F5FD7' }} size={32} />
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
          className="px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base"
          disabled={mutation.isPending}
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
            opacity: mutation.isPending ? 0.6 : 1
          }}
        >
          <Download size={18} />
          <span>{mutation.isPending ? 'Génération...' : 'Générer le contrat'}</span>
        </button>
      </div>
    </div>
  )
}

