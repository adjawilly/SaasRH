import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Save, UserPlus } from 'lucide-react'
import { useNotification } from '../../../contexts/NotificationContext'

const salarieSchema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  email: z.string().email(),
  telephone: z.string().optional(),
  fonction: z.string().min(1),
  dateEmbauche: z.string(),
})

type SalarieForm = z.infer<typeof salarieSchema>

export default function CreateSalarie() {
  const navigate = useNavigate()
  const notification = useNotification()

  const { data: fonctions } = useQuery({
    queryKey: ['fonctions'],
    queryFn: async () => {
      const response = await (api as any).get('/api/parametrage/fonctions')
      return response.data
    },
  })

  const form = useForm<SalarieForm>({
    resolver: zodResolver(salarieSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: SalarieForm) => {
      const response = await (api as any).post('/api/gestion-admin/salaries', data)
      return response.data
    },
    onSuccess: () => {
      notification.success('Salarié créé avec succès', 'Le salarié a été ajouté à la liste')
      navigate('/gestion-admin')
    },
    onError: (error: any) => {
      notification.error('Erreur', error.response?.data?.message || 'Erreur lors de la création du salarié')
    },
  })

  const onSubmit = (data: SalarieForm) => {
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
            <UserPlus size={28} style={{ color: '#2F5FD7' }} />
            <span>Nouveau salarié</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Créer un nouveau salarié</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="card border-2 border-blue-200 bg-blue-50/30 space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
            <input {...form.register('nom')} className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
            {form.formState.errors.nom && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.nom.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
            <input {...form.register('prenom')} className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
            {form.formState.errors.prenom && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.prenom.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input {...form.register('email')} type="email" className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input {...form.register('telephone')} className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fonction *</label>
          <select {...form.register('fonction')} className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
            <option value="">Sélectionner</option>
            {fonctions?.map((f: any) => (
              <option key={f.id} value={f.libelle}>{f.libelle}</option>
            ))}
          </select>
          {form.formState.errors.fonction && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.fonction.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date d'embauche *</label>
          <input {...form.register('dateEmbauche')} type="date" className="input-field bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500" />
          {form.formState.errors.dateEmbauche && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.dateEmbauche.message}</p>
          )}
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

