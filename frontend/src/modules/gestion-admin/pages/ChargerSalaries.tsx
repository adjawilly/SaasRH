import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Upload, FileSpreadsheet } from 'lucide-react'
import { toast } from 'react-toastify'

export default function ChargerSalaries() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/api/gestion-admin/salaries/charger', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success(`${data.count} salarié(s) chargé(s) avec succès`)
      navigate('/gestion-admin')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors du chargement')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file) {
      mutation.mutate(file)
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
          <h1 className="text-3xl font-bold text-gray-800">Charger des salariés</h1>
          <p className="text-gray-600 mt-2">Importez un fichier Excel</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 bg-primary-100 rounded-lg">
            <FileSpreadsheet className="text-primary-700" size={32} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Fichier Excel</h2>
            <p className="text-gray-600">Sélectionnez un fichier Excel contenant les données des salariés</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fichier Excel
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="input-field"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/gestion-admin')}
              className="btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
              disabled={!file || mutation.isPending}
            >
              <Upload size={20} />
              <span>{mutation.isPending ? 'Chargement...' : 'Charger'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

