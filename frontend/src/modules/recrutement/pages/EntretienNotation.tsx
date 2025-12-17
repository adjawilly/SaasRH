import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Save, Star } from 'lucide-react'
import { toast } from 'react-toastify'

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

  const { data: candidature } = useQuery({
    queryKey: ['candidature', id],
    queryFn: async () => {
      const response = await axios.get(`/api/recrutement/candidatures/${id}`)
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
      const response = await axios.post(`/api/recrutement/candidatures/${id}/entretien`, data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Notation enregistrée avec succès')
      navigate('/recrutement/candidatures')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement')
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
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/recrutement/candidatures')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notation entretien</h1>
          <p className="text-gray-600 mt-2">
            {candidature?.prenom} {candidature?.nom}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="card space-y-6">
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

        <div className="p-4 bg-primary-50 rounded-lg">
          <p className="text-sm text-gray-600">Note totale</p>
          <p className="text-3xl font-bold text-primary-700">{totalNote}/80</p>
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

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/recrutement/candidatures')}
            className="btn-secondary"
          >
            Annuler
          </button>
          <button type="submit" className="btn-primary flex items-center space-x-2" disabled={mutation.isPending}>
            <Save size={20} />
            <span>{mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

