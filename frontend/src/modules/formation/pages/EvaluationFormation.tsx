import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Save, Star } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

export default function EvaluationFormation() {
  const navigate = useNavigate()
  const notification = useNotification()
  const form = useForm()

  const { data: formations } = useQuery({
    queryKey: ['formations-evaluation'],
    queryFn: async () => {
      const response = await (api as any).get('/api/formation')
      return response.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const formationId = data.formationId
      const response = await (api as any).post(`/api/formation/${formationId}/evaluation`, {
        type: data.type,
        note: data.note,
        commentaire: data.commentaire,
      })
      return response.data
    },
    onSuccess: () => {
      notification.success('Évaluation enregistrée', 'Votre évaluation a été enregistrée avec succès')
      form.reset()
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'enregistrement de l\'évaluation')
    },
  })

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate('/formation')} 
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
            <Star size={22} style={{ color: '#2F5FD7' }} />
            <span>Évaluation formation</span>
          </h1>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Évaluez vos formations terminées</p>
        </div>
      </div>
      
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="card border-2 border-blue-200 bg-blue-50/30 space-y-4 md:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Formation *</label>
          <select 
            {...form.register('formationId')} 
            className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Sélectionner</option>
            {formations?.map((f: any) => (
              <option key={f.id} value={f.id}>{f.libelle}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type d'évaluation *</label>
          <select 
            {...form.register('type')} 
            className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="chaud">À chaud</option>
            <option value="froid">À froid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Note (1-5) *</label>
          <input 
            {...form.register('note')} 
            type="number" 
            min="1" 
            max="5" 
            className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ex: 4"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
          <textarea 
            {...form.register('commentaire')} 
            rows={4} 
            className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Ajoutez un commentaire sur la formation..."
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/formation')} 
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

