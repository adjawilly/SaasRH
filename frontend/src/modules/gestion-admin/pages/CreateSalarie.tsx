import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'react-toastify'

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

  const { data: fonctions } = useQuery({
    queryKey: ['fonctions'],
    queryFn: async () => {
      const response = await axios.get('/api/parametrage/fonctions')
      return response.data
    },
  })

  const form = useForm<SalarieForm>({
    resolver: zodResolver(salarieSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: SalarieForm) => {
      const response = await axios.post('/api/gestion-admin/salaries', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Salarié créé avec succès')
      navigate('/gestion-admin')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création')
    },
  })

  const onSubmit = (data: SalarieForm) => {
    mutation.mutate(data)
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
          <h1 className="text-3xl font-bold text-gray-800">Nouveau salarié</h1>
          <p className="text-gray-600 mt-2">Créer un nouveau salarié</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
            <input {...form.register('nom')} className="input-field" />
            {form.formState.errors.nom && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.nom.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
            <input {...form.register('prenom')} className="input-field" />
            {form.formState.errors.prenom && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.prenom.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input {...form.register('email')} type="email" className="input-field" />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input {...form.register('telephone')} className="input-field" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fonction *</label>
          <select {...form.register('fonction')} className="input-field">
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
          <input {...form.register('dateEmbauche')} type="date" className="input-field" />
          {form.formState.errors.dateEmbauche && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.dateEmbauche.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/gestion-admin')} className="btn-secondary">
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

