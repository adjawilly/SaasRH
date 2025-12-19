import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Save, Star, ClipboardList } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

const notationSchema = z.object({
  noteTechnique: z.number().min(0).max(20),
  noteCommunication: z.number().min(0).max(20),
  noteMotivation: z.number().min(0).max(20),
  noteCulture: z.number().min(0).max(20),
  commentaire: z.string().optional(),
})

type NotationForm = z.infer<typeof notationSchema>

export default function EntretienNotation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notification = useNotification()

  const { data: candidature } = useQuery({
    queryKey: ['candidature', id],
    queryFn: async () => {
      const response = await (api as any).get(`/api/recrutement/candidatures/${id}`)
      return response.data
    },
  })

  const form = useForm<NotationForm>({
    resolver: zodResolver(notationSchema),
    defaultValues: {
      noteTechnique: 0,
      noteCommunication: 0,
      noteMotivation: 0,
      noteCulture: 0,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: NotationForm) => {
      const response = await (api as any).post(`/api/recrutement/candidatures/${id}/entretien`, data)
      return response.data
    },
    onSuccess: () => {
      notification.success('Notation enregistrée avec succès', 'Les notes ont été sauvegardées')
      navigate('/recrutement/candidatures')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'enregistrement')
    },
  })

  const onSubmit = (data: NotationForm) => {
    mutation.mutate(data)
  }

  const totalNote = form.watch('noteTechnique') + 
                   form.watch('noteCommunication') + 
                   form.watch('noteMotivation') + 
                   form.watch('noteCulture')

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <button
          onClick={() => navigate('/recrutement/candidatures')}
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
            <ClipboardList size={28} style={{ color: '#2F5FD7' }} />
            <span>Notation entretien</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
            {candidature?.prenom} {candidature?.nom}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="card border-2 border-blue-200 bg-blue-50/30 space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note technique (0-20)
            </label>
            <input
              {...form.register('noteTechnique', { valueAsNumber: true })}
              type="number"
              min="0"
              max="20"
              step="0.5"
              className="input-field"
            />
            {form.formState.errors.noteTechnique && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.noteTechnique.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note communication (0-20)
            </label>
            <input
              {...form.register('noteCommunication', { valueAsNumber: true })}
              type="number"
              min="0"
              max="20"
              step="0.5"
              className="input-field"
            />
            {form.formState.errors.noteCommunication && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.noteCommunication.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note motivation (0-20)
            </label>
            <input
              {...form.register('noteMotivation', { valueAsNumber: true })}
              type="number"
              min="0"
              max="20"
              step="0.5"
              className="input-field"
            />
            {form.formState.errors.noteMotivation && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.noteMotivation.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note culture d'entreprise (0-20)
            </label>
            <input
              {...form.register('noteCulture', { valueAsNumber: true })}
              type="number"
              min="0"
              max="20"
              step="0.5"
              className="input-field"
            />
            {form.formState.errors.noteCulture && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.noteCulture.message}</p>
            )}
          </div>
        </div>

        <div className="p-4 rounded-lg border-2" style={{ borderColor: '#2F5FD7', background: 'rgba(47, 95, 215, 0.1)' }}>
          <p className="text-sm text-gray-600">Note totale</p>
          <p className="text-3xl font-bold" style={{ color: '#2F5FD7' }}>{totalNote}/80</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire
          </label>
          <textarea
            {...form.register('commentaire')}
            rows={4}
            className="input-field"
            placeholder="Ajoutez vos observations..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/recrutement/candidatures')}
            className="px-4 py-2 md:px-6 md:py-2.5 rounded-lg border-2 bg-white hover:bg-gray-50 transition-colors font-medium text-sm md:text-base"
            style={{ borderColor: '#2F5FD7', color: '#2F5FD7' }}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 md:px-6 md:py-2.5 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm md:text-base" 
            disabled={mutation.isPending}
            style={{
              background: 'linear-gradient(180deg, #2B3FAE 0%, #2F5FD7 50%, #3FA9F5 100%)',
              opacity: mutation.isPending ? 0.6 : 1
            }}
          >
            <Save size={18} />
            <span>{mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

