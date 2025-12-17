import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Upload, Download, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useState } from 'react'

export default function DocumentsSalarie() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('')

  const { data: salarie } = useQuery({
    queryKey: ['salarie', id],
    queryFn: async () => {
      const response = await axios.get(`/api/gestion-admin/salaries/${id}`)
      return response.data
    },
  })

  const { data: documents, refetch } = useQuery({
    queryKey: ['documents', id],
    queryFn: async () => {
      const response = await axios.get(`/api/gestion-admin/salaries/${id}/documents`)
      return response.data
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; type: string }) => {
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('type', data.type)
      const response = await axios.post(`/api/gestion-admin/salaries/${id}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Document ajouté avec succès')
      refetch()
      setFile(null)
      setDocumentType('')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (docId: string) => {
      await axios.delete(`/api/gestion-admin/salaries/${id}/documents/${docId}`)
    },
    onSuccess: () => {
      toast.success('Document supprimé')
      refetch()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file && documentType) {
      uploadMutation.mutate({ file, type: documentType })
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-800">Documents salarié</h1>
          <p className="text-gray-600 mt-2">
            {salarie?.prenom} {salarie?.nom}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ajouter un document</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de document</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="input-field"
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
                className="input-field"
              />
            </div>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2 w-full"
              disabled={!file || !documentType || uploadMutation.isPending}
            >
              <Upload size={20} />
              <span>Ajouter</span>
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents existants</h2>
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
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <Download size={20} />
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

