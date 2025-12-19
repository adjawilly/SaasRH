import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Upload, Download, Trash2, FileText } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'
import { useState } from 'react'

export default function DocumentsSalarie() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notification = useNotification()
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('')

  const { data: salarie } = useQuery({
    queryKey: ['salarie', id],
    queryFn: async () => {
      const response = await (api as any).get(`/api/gestion-admin/salaries/${id}`)
      return response.data
    },
  })

  const { data: documents, refetch } = useQuery({
    queryKey: ['documents', id],
    queryFn: async () => {
      const response = await (api as any).get(`/api/gestion-admin/salaries/${id}/documents`)
      return response.data
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; type: string }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('type', data.type)
      const response = await (api as any).post(`/api/gestion-admin/salaries/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: () => {
      notification.success('Document ajouté avec succès', 'Le document a été téléchargé et ajouté au dossier')
      refetch()
      setFile(null)
      setDocumentType('')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'ajout du document')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
      await (api as any).delete(`/api/gestion-admin/salaries/${id}/documents/${docId}`)
    },
    onSuccess: () => {
      notification.success('Document supprimé', 'Le document a été supprimé avec succès')
      refetch()
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la suppression')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file && documentType) {
      uploadMutation.mutate({ file, type: documentType })
    }
  }

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
            <span>Documents salarié</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
            {salarie?.prenom} {salarie?.nom}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Upload size={20} style={{ color: '#2F5FD7' }} />
            <span>Ajouter un document</span>
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de document</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Sélectionner</option>
                <option value="CV">CV</option>
                <option value="Contrat">Contrat</option>
                <option value="CNI">CNI</option>
                <option value="Diplome">Diplôme</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fichier</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
              }}
              disabled={!file || !documentType || uploadMutation.isPending}
            >
              <Upload size={20} />
              <span>Ajouter</span>
            </button>
          </form>
        </div>

        <div className="card border-2 border-blue-200 bg-blue-50/30">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <FileText size={20} style={{ color: '#2F5FD7' }} />
            <span>Documents existants</span>
          </h2>
          <div className="space-y-2">
            {documents?.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{doc.type}</p>
                  <p className="text-sm text-gray-600">{doc.nomFichier}</p>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    style={{ color: '#2F5FD7' }}
                  >
                    <Download size={18} />
                  </a>
                  <button
                    onClick={() => deleteMutation.mutate(doc.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

