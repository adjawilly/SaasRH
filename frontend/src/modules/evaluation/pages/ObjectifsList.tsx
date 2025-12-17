import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Target } from 'lucide-react'

export default function ObjectifsList() {
  const navigate = useNavigate()
  const { data: objectifs } = useQuery({
    queryKey: ['objectifs'],
    queryFn: async () => {
      const response = await axios.get('/api/evaluation/objectifs')
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Objectifs</h1>
          <p className="text-gray-600 mt-2">Fixation et suivi des objectifs</p>
        </div>
        <button onClick={() => navigate('/evaluation/auto-evaluation')} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Nouvel objectif</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {objectifs?.map((obj: any) => (
          <div key={obj.id} className="card">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="text-primary-600" size={24} />
              <h3 className="text-lg font-semibold">{obj.libelle}</h3>
            </div>
            <p className="text-gray-600 mb-4">{obj.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Progression: {obj.progression}%</span>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${obj.progression}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

