import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Save, CalendarX } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

const absenceSchema = z.object({
  dateDebut: z.string(),
  dateFin: z.string(),
  motif: z.string().min(1),
})

export default function DemandeAbsence() {
  const navigate = useNavigate()
  const notification = useNotification()
  const form = useForm({
    resolver: zodResolver(absenceSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await (api as any).post('/api/demande-admin/absences', { ...data, type: 'absence' })
      return response.data
    },
    onSuccess: () => {
      notification.success('Demande d\'absence créée', 'Votre demande a été envoyée avec succès')
      navigate('/demande-admin')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la création de la demande')
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
            <CalendarX size={28} style={{ color: '#2F5FD7' }} />
            <span>Demande d'absence</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Remplissez le formulaire pour demander une absence</p>
        </div>
      </div>
      
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="card border-2 border-blue-200 bg-blue-50/30 space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date début *</label>
            <input 
              {...form.register('dateDebut')} 
              type="date" 
              className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
            />
            {form.formState.errors.dateDebut && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.dateDebut.message as string}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date fin *</label>
            <input 
              {...form.register('dateFin')} 
              type="date" 
              className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" 
            />
            {form.formState.errors.dateFin && (
              <p className="text-red-500 text-xs mt-1">{form.formState.errors.dateFin.message as string}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Motif *</label>
          <textarea 
            {...form.register('motif')} 
            rows={4} 
            className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Indiquez le motif de votre absence..."
          />
          {form.formState.errors.motif && (
            <p className="text-red-500 text-xs mt-1">{form.formState.errors.motif.message as string}</p>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button 
            type="button" 
            onClick={() => navigate('/demande-admin')} 
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
            <span>{mutation.isPending ? 'Envoi...' : 'Envoyer'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

