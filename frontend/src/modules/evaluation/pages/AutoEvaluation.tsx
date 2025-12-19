import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '../../../api'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'react-toastify'

export default function AutoEvaluation() {
  const navigate = useNavigate()
  const form = useForm()

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/api/evaluation/auto-evaluation', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Auto-évaluation enregistrée')
      navigate('/evaluation')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/evaluation')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Auto-évaluation</h1>
      </div>
      <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Objectif</label>
          <input {...form.register('objectif')} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Auto-évaluation</label>
          <textarea {...form.register('evaluation')} rows={6} className="input-field" />
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/evaluation')} className="btn-secondary">Annuler</button>
          <button type="submit" className="btn-primary">Enregistrer</button>
        </div>
      </form>
    </div>
  )
}

