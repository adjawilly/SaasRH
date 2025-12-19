import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Upload, FileSpreadsheet } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

export default function ChargerSalaries() {
  const navigate = useNavigate()
  const notification = useNotification()
  const [file, setFile] = useState<File | null>(null)

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const response = await (api as any).post('/api/gestion-admin/salaries/charger', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data
    },
    onSuccess: (data) => {
      notification.success(`${data.count} salarié(s) chargé(s) avec succès`, 'Les salariés ont été importés depuis le fichier Excel')
      navigate('/gestion-admin')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors du chargement du fichier')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file) {
      mutation.mutate(file)
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
            <Upload size={28} style={{ color: '#2F5FD7' }} />
            <span>Charger des salariés</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Importez un fichier Excel</p>
        </div>
      </div>

      <div className="card border-2 border-blue-200 bg-blue-50/30">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-4 rounded-lg border-2" style={{ borderColor: '#2F5FD7', backgroundColor: '#EBF4FF' }}>
            <FileSpreadsheet size={32} style={{ color: '#2F5FD7' }} />
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
              className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/gestion-admin')}
              className="px-4 py-2 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors font-medium"
              style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
              }}
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

