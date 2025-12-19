import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Save, FileEdit } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

export default function AutoEvaluation() {
  const navigate = useNavigate()
  const notification = useNotification()
  const form = useForm()

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await (api as any).post('/api/evaluation/auto-evaluation', data)
      return response.data
    },
    onSuccess: () => {
      notification.success('Auto-évaluation enregistrée', 'Votre auto-évaluation a été enregistrée avec succès')
      navigate('/evaluation')
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
          onClick={() => navigate('/evaluation')} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          style={{ color: '#2F5FD7' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 
            className="text-xl md:text-2xl font-bold flex items-center space-x-2"
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            <FileEdit size={22} style={{ color: '#2F5FD7' }} />
            <span>Auto-évaluation</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Remplissez votre auto-évaluation</p>
        </div>
      </div>
      
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="card border-2 border-blue-200 bg-blue-50/30 space-y-4 md:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Objectif *</label>
          <input 
            {...form.register('objectif')} 
            className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Indiquez l'objectif à évaluer..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Auto-évaluation *</label>
          <textarea 
            {...form.register('evaluation')} 
            rows={6} 
            className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Décrivez votre auto-évaluation..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/evaluation')} 
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
            disabled={mutation.isPending}
          >
            <Save size={20} />
            <span>{mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

