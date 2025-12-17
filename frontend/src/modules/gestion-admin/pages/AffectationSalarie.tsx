import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'react-toastify'

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

  const { data: salarie } = useQuery({
    queryKey: ['salarie', id],
    queryFn: async () => {
      const response = await axios.get(`/api/gestion-admin/salaries/${id}`)
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
      const response = await axios.post(`/api/gestion-admin/salaries/${id}/affectation`, data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Affectation enregistrée avec succès')
      navigate('/gestion-admin')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur')
    },
  })

  const onSubmit = (data: AffectationForm) => {
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
          <h1 className="text-3xl font-bold text-gray-800">Affectation salarié</h1>
          <p className="text-gray-600 mt-2">
            {salarie?.prenom} {salarie?.nom}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Poste *</label>
          <input {...form.register('poste')} className="input-field" />
          {form.formState.errors.poste && (
            <p className="text-red-500 text-sm mt-1">{form.formState.errors.poste.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date d'affectation *</label>
          <input {...form.register('dateAffectation')} type="date" className="input-field" />
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
          <select {...form.register('statut')} className="input-field">
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
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

