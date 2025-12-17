import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'react-toastify'

export default function EvaluationFormation() {
  const navigate = useNavigate()
  const form = useForm()

  const { data: formations } = useQuery({
    queryKey: ['formations-evaluation'],
    queryFn: async () => {
      const response = await axios.get('/api/formation/evaluation')
      return response.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/formation/evaluation', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Évaluation enregistrée')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/formation')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Évaluation formation</h1>
      </div>
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Formation</label>
          <select {...form.register('formationId')} className="input-field">
            <option value="">Sélectionner</option>
            {formations?.map((f: any) => (
              <option key={f.id} value={f.id}>{f.libelle}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type d'évaluation</label>
          <select {...form.register('type')} className="input-field">
            <option value="chaud">À chaud</option>
            <option value="froid">À froid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Note (1-5)</label>
          <input {...form.register('note')} type="number" min="1" max="5" className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
          <textarea {...form.register('commentaire')} rows={4} className="input-field" />
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/formation')} className="btn-secondary">Annuler</button>
          <button type="submit" className="btn-primary">Enregistrer</button>
        </div>
      </form>
    </div>
  )
}

