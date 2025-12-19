import { useQuery } from '@tanstack/react-query'
import api from '../../../api'
import { Award } from 'lucide-react'

export default function CartographieCompetences() {
  const { data: competences } = useQuery({
    queryKey: ['cartographie-competences'],
    queryFn: async () => {
      const response = await api.get('/api/evaluation/cartographie')
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Cartographie des compétences</h1>
        <p className="text-gray-600 mt-2">Visualisez les compétences de votre équipe</p>
      </div>
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competences?.map((comp: any) => (
            <div key={comp.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="text-primary-600" size={20} />
                <h3 className="font-semibold">{comp.nom}</h3>
              </div>
              <p className="text-sm text-gray-600">Niveau: {comp.niveau}/5</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

