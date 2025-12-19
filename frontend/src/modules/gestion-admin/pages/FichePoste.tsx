import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

export default function FichePoste() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notification = useNotification()

  const { data: salarie } = useQuery({
    queryKey: ['salarie', id],
    queryFn: async () => {
      const response = await (api as any).get(`/api/gestion-admin/salaries/${id}`)
      return response.data
    },
  })

  const generateMutation = useMutation({
    mutationFn: async (format: 'pdf' | 'excel' | 'word') => {
      const response = await (api as any).post(`/api/gestion-admin/salaries/${id}/fiche-poste`, { format }, {
        responseType: 'blob',
      })
      return response.data
    },
    onSuccess: (data, format) => {
      const blob = new Blob([data])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fiche-poste-${salarie?.matricule}.${format === 'excel' ? 'xlsx' : format === 'word' ? 'docx' : 'pdf'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      notification.success('Fiche de poste générée', 'Le fichier a été téléchargé avec succès')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la génération de la fiche de poste')
    },
  })

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/gestion-admin')}
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
            <span>Fiche de poste</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
            {salarie?.prenom} {salarie?.nom}
          </p>
        </div>
      </div>

      <div className="card border-2 border-blue-200 bg-blue-50/30">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 rounded-lg border-2" style={{ borderColor: '#2F5FD7', backgroundColor: '#EBF4FF' }}>
            <FileText size={32} style={{ color: '#2F5FD7' }} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Générer la fiche de poste</h2>
            <p className="text-gray-600">Choisissez le format d'export</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => generateMutation.mutate('pdf')}
            className="p-6 border-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ 
              borderColor: '#2F5FD7',
              backgroundColor: generateMutation.isPending ? '#f3f4f6' : 'white'
            }}
            disabled={generateMutation.isPending}
          >
            <Download className="mx-auto mb-2" size={32} style={{ color: '#2F5FD7' }} />
            <p className="font-medium" style={{ color: '#2F5FD7' }}>PDF</p>
          </button>
          <button
            onClick={() => generateMutation.mutate('excel')}
            className="p-6 border-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ 
              borderColor: '#2F5FD7',
              backgroundColor: generateMutation.isPending ? '#f3f4f6' : 'white'
            }}
            disabled={generateMutation.isPending}
          >
            <Download className="mx-auto mb-2" size={32} style={{ color: '#2F5FD7' }} />
            <p className="font-medium" style={{ color: '#2F5FD7' }}>Excel</p>
          </button>
          <button
            onClick={() => generateMutation.mutate('word')}
            className="p-6 border-2 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ 
              borderColor: '#2F5FD7',
              backgroundColor: generateMutation.isPending ? '#f3f4f6' : 'white'
            }}
            disabled={generateMutation.isPending}
          >
            <Download className="mx-auto mb-2" size={32} style={{ color: '#2F5FD7' }} />
            <p className="font-medium" style={{ color: '#2F5FD7' }}>Word</p>
          </button>
        </div>
      </div>
    </div>
  )
}

