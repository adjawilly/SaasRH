import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Download, FileCheck } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

export default function DemandeAttestation() {
  const navigate = useNavigate()
  const notification = useNotification()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await (api as any).post('/api/demande-admin/attestations', { type: 'attestation' })
      return response.data
    },
    onSuccess: (data) => {
      if (data.url) {
        window.open(data.url, '_blank')
      }
      notification.success('Attestation générée', 'Votre attestation de travail a été générée avec succès')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la génération de l\'attestation')
    },
  })

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/demande-admin')} 
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
            <FileCheck size={28} style={{ color: '#2F5FD7' }} />
            <span>Attestation de travail</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Générez votre attestation de travail</p>
        </div>
      </div>
      
      <div className="card border-2 border-blue-200 bg-blue-50/30">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 rounded-lg border-2" style={{ borderColor: '#2F5FD7', backgroundColor: '#EBF4FF' }}>
            <FileCheck size={32} style={{ color: '#2F5FD7' }} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Générer une attestation de travail</h2>
            <p className="text-gray-600">Cliquez sur le bouton ci-dessous pour générer votre attestation</p>
          </div>
        </div>
        <button 
          onClick={() => mutation.mutate()} 
          className="w-full px-6 py-3 md:py-4 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
          }}
          disabled={mutation.isPending}
        >
          <Download size={20} />
          <span>{mutation.isPending ? 'Génération...' : 'Générer l\'attestation'}</span>
        </button>
      </div>
    </div>
  )
}

