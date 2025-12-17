import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'react-toastify'

const congeSchema = z.object({
  dateDebut: z.string(),
  dateFin: z.string(),
  typeConge: z.string(),
})

export default function DemandeConge() {
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(congeSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/demande-admin/conges', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Demande de congé créée')
      navigate('/demande-admin')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/demande-admin')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Demande de congé</h1>
      </div>
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type de congé</label>
          <select {...form.register('typeConge')} className="input-field">
            <option value="">Sélectionner</option>
            <option value="annuel">Congé annuel</option>
            <option value="maladie">Congé maladie</option>
            <option value="maternite">Congé maternité</option>
            <option value="paternite">Congé paternité</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
            <input {...form.register('dateDebut')} type="date" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
            <input {...form.register('dateFin')} type="date" className="input-field" />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/demande-admin')} className="btn-secondary">Annuler</button>
          <button type="submit" className="btn-primary">Envoyer</button>
        </div>
      </form>
    </div>
  )
}

