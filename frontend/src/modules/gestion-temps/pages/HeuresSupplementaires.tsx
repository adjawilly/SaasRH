import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { ArrowLeft, Save } from 'lucide-react'
import { toast } from 'react-toastify'

export default function HeuresSupplementaires() {
  const navigate = useNavigate()
  const form = useForm()

  const { data: heures } = useQuery({
    queryKey: ['heures-supplementaires'],
    queryFn: async () => {
      const response = await axios.get('/api/gestion-temps/heures-supplementaires')
      return response.data
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/gestion-temps/heures-supplementaires', data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Heures supplémentaires enregistrées')
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate('/gestion-temps')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Heures supplémentaires</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Enregistrer des heures</h2>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input {...form.register('date')} type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'heures</label>
              <input {...form.register('heures')} type="number" step="0.5" className="input-field" />
            </div>
            <button type="submit" className="btn-primary w-full">Enregistrer</button>
          </form>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Historique</h2>
          <div className="space-y-2">
            {heures?.map((h: any) => (
              <div key={h.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{h.date}</p>
                <p className="text-sm text-gray-600">{h.heures}h</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

