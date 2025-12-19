import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

export default function HeuresSupplementaires() {
  const navigate = useNavigate()
  const notification = useNotification()
  const form = useForm()

  const { data: heures, isLoading } = useQuery({
    queryKey: ['heures-supplementaires'],
    queryFn: async () => {
      const response = await (api as any).get('/api/gestion-temps/heures-supplementaires')
      return response.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await (api as any).post('/api/gestion-temps/heures-supplementaires', data)
      return response.data
    },
    onSuccess: () => {
      notification.success('Heures supplémentaires enregistrées', 'Vos heures supplémentaires ont été enregistrées avec succès')
      form.reset()
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'enregistrement')
    },
  })

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/gestion-temps')} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          style={{ color: '#2F5FD7' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center space-x-3">
          <h1 
            className="text-xl md:text-2xl font-bold flex items-center space-x-2"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            <Clock size={22} style={{ color: '#2F5FD7' }} />
            <span>Heures supplémentaires</span>
          </h1>
          <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-600/50 text-white flex items-center space-x-1">
            <AlertCircle size={12} />
            <span>En développement</span>
          </span>
        </div>
      </div>
      <p className="text-xs md:text-sm text-gray-600">Enregistrez et consultez vos heures supplémentaires</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="card border-2 border-blue-200 bg-blue-50/30 relative">
          <span className="absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium bg-red-600/50 text-white">
            indisponible
          </span>
          <h2 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Clock size={18} style={{ color: '#2F5FD7' }} />
            <span>Enregistrer des heures</span>
          </h2>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input 
                {...form.register('date')} 
                type="date" 
                className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'heures *</label>
              <input 
                {...form.register('heures')} 
                type="number" 
                step="0.5" 
                className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: 2.5"
              />
            </div>
            <button 
              type="submit" 
              className="w-full px-4 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)'
              }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </div>
        <div className="card border-2 border-blue-200 bg-blue-50/30 relative">
          <span className="absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium bg-red-600/50 text-white">
            indisponible
          </span>
          <h2 className="text-lg font-semibold mb-4">Historique</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#2F5FD7' }}></div>
            </div>
          ) : heures && heures.length > 0 ? (
            <div className="space-y-2">
              {heures.map((h: any) => (
                <div key={h.id} className="p-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                  <p className="font-medium text-gray-800">{new Date(h.date).toLocaleDateString('fr-FR')}</p>
                  <p className="text-sm text-gray-600">{h.heures}h</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Aucune heure supplémentaire enregistrée</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

