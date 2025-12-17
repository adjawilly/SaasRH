import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'react-toastify'

const absenceSchema = z.object({
  dateDebut: z.string(),
  dateFin: z.string(),
  motif: z.string().min(1),
})

export default function DemandeAbsence() {
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(absenceSchema),
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/demande-admin/absences', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Demande d\'absence créée')
      navigate('/demande-admin')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/demande-admin')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Demande d'absence</h1>
      </div>
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="card space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Motif</label>
          <textarea {...form.register('motif')} rows={4} className="input-field" />
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/demande-admin')} className="btn-secondary">Annuler</button>
          <button type="submit" className="btn-primary">Envoyer</button>
        </div>
      </form>
    </div>
  )
}

