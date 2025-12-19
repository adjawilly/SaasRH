import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Download, FileText } from 'lucide-react'
import { toast } from 'react-toastify'

export default function FichePoste() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: salarie } = useQuery({
    queryKey: ['salarie', id],
    queryFn: async () => {
      const response = await api.get(`/api/gestion-admin/salaries/${id}`)
      return response.data
    },
  })

  const generateMutation = useMutation({
    mutationFn: async (format: 'pdf' | 'excel' | 'word') => {
      const response = await api.post(`/api/gestion-admin/salaries/${id}/fiche-poste`, { format }, {
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
      toast.success('Fiche de poste générée')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/gestion-admin')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Fiche de poste</h1>
          <p className="text-gray-600 mt-2">
            {salarie?.prenom} {salarie?.nom}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 bg-primary-100 rounded-lg">
            <FileText className="text-primary-700" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Générer la fiche de poste</h2>
            <p className="text-gray-600">Choisissez le format d'export</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => generateMutation.mutate('pdf')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            disabled={generateMutation.isPending}
          >
            <Download className="mx-auto mb-2 text-primary-600" size={32} />
            <p className="font-medium">PDF</p>
          </button>
          <button
            onClick={() => generateMutation.mutate('excel')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            disabled={generateMutation.isPending}
          >
            <Download className="mx-auto mb-2 text-primary-600" size={32} />
            <p className="font-medium">Excel</p>
          </button>
          <button
            onClick={() => generateMutation.mutate('word')}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            disabled={generateMutation.isPending}
          >
            <Download className="mx-auto mb-2 text-primary-600" size={32} />
            <p className="font-medium">Word</p>
          </button>
        </div>
      </div>
    </div>
  )
}

