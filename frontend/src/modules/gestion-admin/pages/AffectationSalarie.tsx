import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Save, UserCheck } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

const affectationSchema = z.object({
  poste: z.string().min(1),
  dateAffectation: z.string(),
  direction: z.string().min(1),
  statut: z.enum(['actif', 'inactif']),
})

type AffectationForm = z.infer<typeof affectationSchema>

export default function AffectationSalarie() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notification = useNotification()

  const { data: salarie } = useQuery({
    queryKey: ['salarie', id],
    queryFn: async () => {
      const response = await (api as any).get(`/api/gestion-admin/salaries/${id}`)
      return response.data
    },
  })

  const form = useForm<AffectationForm>({
    resolver: zodResolver(affectationSchema),
    defaultValues: {
      statut: 'actif',
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: AffectationForm) => {
      const response = await (api as any).post(`/api/gestion-admin/salaries/${id}/affectation`, data)
      return response.data
    },
    onSuccess: () => {
      notification.success('Affectation enregistrée avec succès', 'L\'affectation du salarié a été mise à jour')
      navigate('/gestion-admin')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de l\'enregistrement de l\'affectation')
    },
  })

  const onSubmit = (data: AffectationForm) => {
    mutation.mutate(data)
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
            <UserCheck size={28} style={{ color: '#2F5FD7' }} />
            <span>Affectation salarié</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">
            {salarie?.prenom} {salarie?.nom}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="card border-2 border-blue-200 bg-blue-50/30 space-y-4 md:space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Poste *</label>
          <input {...form.register('poste')} className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
          {form.formState.errors.poste && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.poste.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date d'affectation *</label>
          <input {...form.register('dateAffectation')} type="date" className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
          {form.formState.errors.dateAffectation && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.dateAffectation.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Direction *</label>
          <input {...form.register('direction')} className="input-field" />
          {form.formState.errors.direction && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.direction.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Statut *</label>
          <select {...form.register('statut')} className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
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

